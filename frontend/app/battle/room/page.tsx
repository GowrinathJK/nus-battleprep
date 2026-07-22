"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { realtimeDb, db, auth } from "../../../firebase";
import { ref, onValue, off, runTransaction, set, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, increment, addDoc, collection, getDoc, setDoc } from "firebase/firestore";
import Navbar from "../../../Components/Navbar";

const QUESTION_TIME = 15;

function BattleRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("code") || "";

  const [user, setUser] = useState<any>(null);
  const [roomData, setRoomData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [finished, setFinished] = useState(false);
  const [resultsProcessed, setResultsProcessed] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answeredRef = useRef(false);
  const advancingRef = useRef(false);
  const currentQRef = useRef<number>(-1);

  // auth guard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
    });
    return () => unsub();
  }, []);

  // listen to room
  useEffect(() => {
    if (!roomCode) return;
    const roomRef = ref(realtimeDb, `rooms/${roomCode}`);
    const listener = onValue(roomRef, (snap) => {
      const data = snap.val();
      if (!data) return;
      setRoomData(data);
      if (data.status === "finished") setFinished(true);

      // sync showFeedback from DB
      if (data.showFeedback === true) {
        setShowFeedback(true);
      } else {
        setShowFeedback(false);
      }
    });
    return () => off(roomRef, "value", listener);
  }, [roomCode]);

  // reset when question changes
  useEffect(() => {
    if (!roomData || finished) return;
    const q = roomData.currentQuestion ?? 0;
    if (q !== currentQRef.current) {
      currentQRef.current = q;
      answeredRef.current = false;
      advancingRef.current = false;
      setTimeLeft(QUESTION_TIME);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  }, [roomData?.currentQuestion, finished]);

  // countdown timer
  useEffect(() => {
    if (finished || showFeedback) return;
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, finished, showFeedback]);

  // host watches answers and advances when both players answered
  useEffect(() => {
    if (!roomData || !user || finished) return;
    if (user.uid !== roomData.host) return;
    if (advancingRef.current) return;

    const qIndex = roomData.currentQuestion ?? 0;
    const answers = roomData.answers?.[qIndex] || {};
    const playersAnswered = Object.keys(answers).length;
    const expectedPlayers = roomData.guest ? 2 : 1;

    if (playersAnswered >= expectedPlayers) {
      advancingRef.current = true;
      doAdvance(qIndex);
    }
  }, [roomData?.answers, roomData?.currentQuestion]);

  async function handleTimeUp() {
    if (!user || !roomData) return;
    if (answeredRef.current) return;
    answeredRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);

    const qIndex = roomData.currentQuestion ?? 0;
    // record as unanswered
    await set(
      ref(realtimeDb, `rooms/${roomCode}/answers/${qIndex}/${user.uid}`),
      { answered: false, option: null, timestamp: Date.now() }
    );
  }

  async function handleAnswer(option: string) {
    if (!user || !roomData) return;
    if (answeredRef.current) return;
    answeredRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);

    setSelectedAnswer(option);

    const qIndex = roomData.currentQuestion ?? 0;
    const question = roomData.questions[qIndex];
    const isCorrect = option === question.answer;

    // record answer
    await set(
      ref(realtimeDb, `rooms/${roomCode}/answers/${qIndex}/${user.uid}`),
      { answered: true, option, timestamp: Date.now() }
    );

    // update score
    if (isCorrect) {
      await runTransaction(
        ref(realtimeDb, `rooms/${roomCode}/scores/${user.uid}`),
        (score) => (score || 0) + 1
      );
    }
  }

  async function doAdvance(qIndex: number) {
    if (!roomData) return;

    // show feedback to both players
    await set(ref(realtimeDb, `rooms/${roomCode}/showFeedback`), true);

    // wait 1.5s showing correct answer
    setTimeout(async () => {
      const totalQuestions = roomData.questions.length;

      // clear feedback
      await set(ref(realtimeDb, `rooms/${roomCode}/showFeedback`), false);

      if (qIndex + 1 >= totalQuestions) {
        // end game
        await set(ref(realtimeDb, `rooms/${roomCode}/status`), "finished");
      } else {
        // clear this question's answers then move to next
        await set(ref(realtimeDb, `rooms/${roomCode}/answers/${qIndex}`), null);
        await set(ref(realtimeDb, `rooms/${roomCode}/currentQuestion`), qIndex + 1);
      }

      advancingRef.current = false;
    }, 1500);
  }

  // process results when finished
  useEffect(() => {
    if (!finished || resultsProcessed || !user || !roomData) return;
    setResultsProcessed(true);
    processResults();
  }, [finished, user, roomData]);

async function processResults() {
  if (!roomData || !user) return;
  const scores = roomData.scores || {};
  const hostUid = roomData.host;
  const guestUid = roomData.guest;
  if (!hostUid || !guestUid) return;

  const myScore = scores[user.uid] ?? 0;
  const oppUid = user.uid === hostUid ? guestUid : hostUid;
  const oppScore = scores[oppUid] ?? 0;
  const won = myScore > oppScore;
  const draw = myScore === oppScore;

  const myDocRef = doc(db, "users", user.uid);
  const oppDocRef = doc(db, "users", oppUid);
  const myEloSnap = await getDoc(myDocRef);
  const oppEloSnap = await getDoc(oppDocRef);
  const myElo = myEloSnap.exists() ? (myEloSnap.data().elo ?? 1000) : 1000;
  const oppElo = oppEloSnap.exists() ? (oppEloSnap.data().elo ?? 1000) : 1000;

  const expected = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
  const actual = won ? 1 : draw ? 0.5 : 0;
  const eloChange = Math.round(32 * (actual - expected));

  // update MY stats
const myCurrentData = myEloSnap.exists() ? myEloSnap.data() : {};
const today = new Date().toDateString();
const yesterday = new Date(Date.now() - 86400000).toDateString();
const lastDate = myCurrentData.lastQuizDate || "";

const currentStreak = myCurrentData.streak ?? 0;
let newStreak: number;
if (lastDate === today) {
  // already played today — keep streak as is, minimum 1
  newStreak = currentStreak > 0 ? currentStreak : 1;
} else if (lastDate === yesterday) {
  // played yesterday — increment
  newStreak = currentStreak + 1;
} else {
  // first time or missed a day — start at 1
  newStreak = 1;
}

await setDoc(myDocRef, {
  elo: (myCurrentData.elo ?? 1000) + eloChange,
  xp: (myCurrentData.xp ?? 0) + (won ? 100 : draw ? 30 : 10),
  wins: (myCurrentData.wins ?? 0) + (won ? 1 : 0),
  losses: (myCurrentData.losses ?? 0) + (!won && !draw ? 1 : 0),
  lastQuizDate: today,
  streak: newStreak,
}, { merge: true });

  // save match — only host saves to avoid duplicates
  if (user.uid === hostUid) {
    await addDoc(collection(db, "matches"), {
      roomCode,
      module: roomData.module,
      host: hostUid,
      hostName: roomData.hostName,
      guest: guestUid,
      guestName: roomData.guestName,
      scores,
      winner: won ? user.uid : oppUid,
      draw,
      playedAt: new Date().toISOString(),
    });
  }

  await set(
    ref(realtimeDb, `rooms/${roomCode}/eloChanges/${user.uid}`),
    eloChange
  );
}

  // ── LOADING ──
  if (!roomData || !user) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <Navbar />
        <p className="text-2xl text-zinc-400">Connecting...</p>
      </main>
    );
  }

  const questions = roomData.questions || [];
  const qIndex = roomData.currentQuestion ?? 0;
  const question = questions[qIndex];
  const scores = roomData.scores || {};
  const myScore = scores[user.uid] ?? 0;
  const oppUid = user.uid === roomData.host ? roomData.guest : roomData.host;
  const oppScore = scores[oppUid] ?? 0;
  const oppName = user.uid === roomData.host ? roomData.guestName : roomData.hostName;
  const progress = ((qIndex + 1) / questions.length) * 100;

  // ── FINISHED ──
  if (finished) {
    const won = myScore > oppScore;
    const draw = myScore === oppScore;
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[85vh]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-14 text-center w-[520px] shadow-2xl">
            <div className="text-7xl mb-6">{won ? "🏆" : draw ? "🤝" : "💀"}</div>
            <h1 className="text-5xl font-black mb-4">{won ? "You Win!" : draw ? "Draw!" : "You Lost"}</h1>
            <div className="flex justify-center gap-12 my-8">
              <div>
                <p className="text-zinc-400 mb-1">You</p>
                <p className="text-4xl font-bold text-green-400">{myScore}</p>
              </div>
              <div className="text-zinc-600 text-4xl font-black self-center">vs</div>
              <div>
                <p className="text-zinc-400 mb-1">{oppName}</p>
                <p className="text-4xl font-bold text-red-400">{oppScore}</p>
              </div>
            </div>
            <p className="text-zinc-400 mb-8 text-lg">ELO updated · Match saved</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/battle")}
                className="bg-indigo-600 hover:bg-indigo-500 transition px-8 py-4 rounded-2xl text-lg font-semibold"
              >
                Play Again
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="bg-zinc-700 hover:bg-zinc-600 transition px-8 py-4 rounded-2xl text-lg font-semibold"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!question) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-2xl text-zinc-400">Loading question...</p>
      </main>
    );
  }

  // ── BATTLE UI ──
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="text-center">
            <p className="text-zinc-400 text-sm mb-1">You</p>
            <p className="text-3xl font-bold text-green-400">{myScore}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-400 text-sm mb-1">{roomData.module}</p>
            <p className="text-xl font-bold">{qIndex + 1} / {questions.length}</p>
          </div>
          <div className="text-center">
            <p className="text-zinc-400 text-sm mb-1">{oppName}</p>
            <p className="text-3xl font-bold text-red-400">{oppScore}</p>
          </div>
        </div>

        <div className="w-full bg-zinc-800 h-2 rounded-full mb-6 overflow-hidden">
          <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-zinc-400 mb-1 text-sm uppercase tracking-widest">{question.topic}</p>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                question.difficulty === "easy" ? "bg-green-500/20 text-green-400" :
                question.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-red-500/20 text-red-400"
              }`}>
                {question.difficulty}
              </span>
            </div>
            <div className={`bg-black/40 rounded-2xl px-6 py-4 text-center ${timeLeft <= 5 && !showFeedback ? "animate-pulse" : ""}`}>
              <p className="text-zinc-400 text-xs mb-1">TIME</p>
              <p className={`text-4xl font-bold ${timeLeft <= 5 && !showFeedback ? "text-red-400" : "text-white"}`}>
                {showFeedback ? "✓" : timeLeft}
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-bold leading-tight mb-10">{question.question}</h1>

          <div className="space-y-4">
            {question.options.map((option: string, i: number) => {
              let style = "bg-zinc-800 hover:bg-zinc-700";
              if (showFeedback) {
                if (option === question.answer) style = "bg-green-600";
                else if (option === selectedAnswer) style = "bg-red-600";
                else style = "bg-zinc-800";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback || answeredRef.current}
                  className={`w-full text-left p-5 rounded-2xl text-lg font-medium transition-all duration-200 ${style} disabled:cursor-not-allowed`}
                >
                  <span className="text-zinc-400 mr-3">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div className="mt-6 text-center text-zinc-400 animate-pulse">
              Next question coming up...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function BattleRoomPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white flex items-center justify-center">
          <p>Loading...</p>
        </main>
      }
    >
      <BattleRoomContent />
    </Suspense>
  );
}