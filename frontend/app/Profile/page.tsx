"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Navbar from "../../Components/Navbar";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [currentUid, setCurrentUid] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/login"); return; }
      setCurrentUid(user.uid);

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

       const today = new Date().toDateString();
const yesterday = new Date(Date.now() - 86400000).toDateString();
const lastDate = data.lastQuizDate || "";

const isToday = lastDate === today;
const isYesterday = lastDate === yesterday;

let newStreak = data.streak ?? 0;
if (isToday) {
  newStreak = data.streak ?? 1;
} else if (isYesterday) {
  newStreak = (data.streak ?? 0) + 1;
} else if (lastDate !== "") {
  newStreak = 0;
}

        // update streak and lastQuizDate in Firestore
        await setDoc(docRef, {
          streak: newStreak,
          lastQuizDate: today,
        }, { merge: true });

        setUserData({ ...data, streak: newStreak });
      }

      // fetch last 5 matches
      const q1 = query(collection(db, "matches"), where("host", "==", user.uid));
      const q2 = query(collection(db, "matches"), where("guest", "==", user.uid));
      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const allMatches = [
        ...snap1.docs.map(d => ({ id: d.id, ...d.data() })),
        ...snap2.docs.map(d => ({ id: d.id, ...d.data() })),
      ].sort((a: any, b: any) =>
        new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()
      ).slice(0, 5);

      setMatches(allMatches);
    });
    return () => unsubscribe();
  }, []);

  function getRank(xp: number) {
    if (xp >= 500) return "Legend";
    if (xp >= 250) return "Bell Curve Destroyer";
    if (xp >= 100) return "Dean's Lister";
    if (xp >= 50) return "TA Slayer";
    return "Freshman";
  }

  function getMatchResult(match: any) {
    if (match.draw) return { label: "Draw", color: "text-yellow-400" };
    if (match.winner === currentUid) return { label: "Win", color: "text-green-400" };
    return { label: "Loss", color: "text-red-400" };
  }

  function getOpponentName(match: any) {
    return match.host === currentUid ? match.guestName : match.hostName;
  }

  function getMyScore(match: any) {
    return match.scores?.[currentUid] ?? 0;
  }

  function getOppScore(match: any) {
    const oppUid = match.host === currentUid ? match.guest : match.host;
    return match.scores?.[oppUid] ?? 0;
  }

  if (!userData) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-2xl">Loading Profile...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* header */}
        <div className="bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 rounded-[40px] p-12 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="flex items-center gap-8">
              <div className="w-36 h-36 rounded-full bg-black/30 border-4 border-white/20 flex items-center justify-center text-6xl font-bold">
                {userData.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="text-zinc-200 text-lg mb-2">PLAYER PROFILE</p>
                <h1 className="text-6xl font-black mb-4">{userData.name}</h1>
                <div className="inline-flex items-center gap-3 bg-black/30 px-5 py-3 rounded-2xl">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xl font-bold">{getRank(userData.xp ?? 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-black/30 rounded-3xl p-8 text-center min-w-[220px]">
              <p className="text-zinc-300 text-sm mb-3">TOTAL XP</p>
              <h2 className="text-6xl font-black text-green-400">{userData.xp ?? 0}</h2>
            </div>
          </div>
        </div>

        {/* stats — 4 cards */}
        <div className="grid lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">ELO RATING</p>
            <h2 className="text-5xl font-bold text-indigo-400">{userData.elo ?? 1000}</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">WINS</p>
            <h2 className="text-5xl font-bold text-green-400">{userData.wins ?? 0}</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">LOSSES</p>
            <h2 className="text-5xl font-bold text-red-400">{userData.losses ?? 0}</h2>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">DAILY STREAK</p>
            <h2 className="text-5xl font-bold text-orange-400">🔥 {userData.streak ?? 0}</h2>
          </div>
        </div>

        {/* achievements */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 mb-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Achievement Showcase</h2>
            <p className="text-zinc-400">Milestones unlocked through practice.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className={`rounded-3xl p-8 text-center transition-all ${(userData.xp ?? 0) >= 10 ? "bg-indigo-900/40 border border-indigo-500" : "bg-zinc-800 opacity-40"}`}>
              <div className="text-6xl mb-5">🥇</div>
              <h3 className="text-2xl font-bold mb-3">First Quiz</h3>
              <p className="text-zinc-400">Completed your first quiz.</p>
            </div>
            <div className={`rounded-3xl p-8 text-center transition-all ${(userData.streak ?? 0) >= 3 ? "bg-orange-900/40 border border-orange-500" : "bg-zinc-800 opacity-40"}`}>
              <div className="text-6xl mb-5">🔥</div>
              <h3 className="text-2xl font-bold mb-3">Streak Builder</h3>
              <p className="text-zinc-400">3 day streak maintained.</p>
            </div>
            <div className={`rounded-3xl p-8 text-center transition-all ${(userData.xp ?? 0) >= 100 ? "bg-purple-900/40 border border-purple-500" : "bg-zinc-800 opacity-40"}`}>
              <div className="text-6xl mb-5">🧠</div>
              <h3 className="text-2xl font-bold mb-3">100 XP</h3>
              <p className="text-zinc-400">Reached 100 XP.</p>
            </div>
            <div className={`rounded-3xl p-8 text-center transition-all ${(userData.wins ?? 0) >= 1 ? "bg-yellow-900/40 border border-yellow-500" : "bg-zinc-800 opacity-40"}`}>
              <div className="text-6xl mb-5">👑</div>
              <h3 className="text-2xl font-bold mb-3">First Win</h3>
              <p className="text-zinc-400">Won your first battle.</p>
            </div>
          </div>
        </div>

        {/* match history */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Match History</h2>
            <p className="text-zinc-400">Last 5 battles</p>
          </div>
          {matches.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-6xl mb-4">⚔️</p>
              <p className="text-zinc-400 text-xl">No battles played yet. Challenge someone!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {matches.map((match) => {
                const result = getMatchResult(match);
                return (
                  <div key={match.id} className="bg-zinc-800 rounded-2xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`text-2xl font-black w-16 text-center ${result.color}`}>
                        {result.label}
                      </div>
                      <div>
                        <p className="text-xl font-bold">vs {getOpponentName(match)}</p>
                        <p className="text-zinc-400 text-sm">
                          {match.module} · {new Date(match.playedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {getMyScore(match)} — {getOppScore(match)}
                      </p>
                      <p className="text-zinc-400 text-sm">Score</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}