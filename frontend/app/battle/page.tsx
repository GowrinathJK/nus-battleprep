"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../Components/Navbar";
import { db, realtimeDb, auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { ref, set, get, onValue, off } from "firebase/database";

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function BattlePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [mode, setMode] = useState<"menu" | "create" | "join" | "lobby">("menu");
  const [selectedModule, setSelectedModule] = useState("CS2030S");
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [lobbyData, setLobbyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const modules = ["CS2030S", "CS2040S"];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      const snap = await getDoc(doc(db, "users", u.uid));
      if (snap.exists()) setUserData(snap.data());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (mode !== "lobby" || !roomCode) return;
    const roomRef = ref(realtimeDb, `rooms/${roomCode}`);
    const listener = onValue(roomRef, (snap) => {
      const data = snap.val();
      if (!data) return;
      setLobbyData(data);
      if (data.status === "active") {
        router.push(`/battle/room?code=${roomCode}`);
      }
    });
    return () => off(roomRef, "value", listener);
  }, [mode, roomCode]);

  async function handleCreateRoom() {
    setLoading(true);
    setError("");
    try {
      const q = query(collection(db, "questions"), where("module", "==", selectedModule));
      const snap = await getDocs(q);
      let allQs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      allQs = allQs.sort(() => Math.random() - 0.5).slice(0, 10);
      if (allQs.length < 5) {
        setError("Not enough questions in Firestore for this module. Import your question bank first.");
        setLoading(false);
        return;
      }
      const code = generateRoomCode();
      await set(ref(realtimeDb, `rooms/${code}`), {
        host: user.uid,
        hostName: userData?.name || "Player 1",
        guest: null,
        guestName: null,
        module: selectedModule,
        status: "waiting",
        currentQuestion: 0,
        questions: allQs,
        scores: { [user.uid]: 0 },
        answers: {},
        createdAt: Date.now(),
      });
      setRoomCode(code);
      setMode("lobby");
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleJoinRoom() {
    setLoading(true);
    setError("");
    const code = joinCode.trim().toUpperCase();
    try {
      const roomRef = ref(realtimeDb, `rooms/${code}`);
      const snap = await get(roomRef);
      if (!snap.exists()) { setError("Room not found."); setLoading(false); return; }
      const data = snap.val();
      if (data.status !== "waiting") { setError("Room is no longer open."); setLoading(false); return; }
      if (data.host === user.uid) { setError("You created this room — share the code with a friend."); setLoading(false); return; }
      await set(ref(realtimeDb, `rooms/${code}/guest`), user.uid);
      await set(ref(realtimeDb, `rooms/${code}/guestName`), userData?.name || "Player 2");
      await set(ref(realtimeDb, `rooms/${code}/scores/${user.uid}`), 0);
      setRoomCode(code);
      setMode("lobby");
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleStartBattle() {
    if (!lobbyData?.guest) { setError("Waiting for opponent to join..."); return; }
    await set(ref(realtimeDb, `rooms/${roomCode}/status`), "active");
  }

  // MENU
  if (mode === "menu") {
    return (
      <main className="min-h-screen bg-black text-white overflow-hidden">
        <Navbar />
        <div className="relative max-w-5xl mx-auto px-6 py-14">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/10 blur-[150px]" />
          <div className="relative z-10 mb-14">
            <h1 className="text-7xl font-black mb-5">Battle Arena</h1>
            <p className="text-zinc-400 text-2xl max-w-2xl">
              Challenge a friend to a real-time quiz battle and climb the rankings.
            </p>
          </div>
          <div className="relative z-10 grid md:grid-cols-2 gap-8">
            <button
              onClick={() => setMode("create")}
              className="group bg-zinc-900 border border-zinc-800 hover:border-indigo-500 transition-all duration-300 rounded-[32px] p-10 text-left"
            >
              <div className="text-6xl mb-6">⚔️</div>
              <h2 className="text-4xl font-bold mb-3">Create Room</h2>
              <p className="text-zinc-400 text-lg">Host a battle and share the code with your opponent.</p>
              <div className="mt-8 text-indigo-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">Create →</div>
            </button>
            <button
              onClick={() => setMode("join")}
              className="group bg-zinc-900 border border-zinc-800 hover:border-pink-500 transition-all duration-300 rounded-[32px] p-10 text-left"
            >
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-4xl font-bold mb-3">Join Room</h2>
              <p className="text-zinc-400 text-lg">Enter a room code to join your opponent's battle.</p>
              <div className="mt-8 text-pink-400 font-semibold text-lg group-hover:translate-x-2 transition-transform">Join →</div>
            </button>
          </div>
          <div className="relative z-10 mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-zinc-400 mb-1">Your ELO</p>
              <p className="text-3xl font-bold text-yellow-400">{userData?.elo ?? "—"}</p>
            </div>
            <div>
              <p className="text-zinc-400 mb-1">Wins</p>
              <p className="text-3xl font-bold text-green-400">{userData?.wins ?? 0}</p>
            </div>
            <div>
              <p className="text-zinc-400 mb-1">Losses</p>
              <p className="text-3xl font-bold text-red-400">{userData?.losses ?? 0}</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // CREATE
  if (mode === "create") {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-14">
          <button onClick={() => { setMode("menu"); setError(""); }} className="text-zinc-400 hover:text-white mb-8">← Back</button>
          <h1 className="text-5xl font-bold mb-10">Create Room</h1>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 space-y-8">
            <div>
              <p className="text-zinc-400 mb-3">Select Module</p>
              <div className="grid grid-cols-2 gap-4">
                {modules.map(m => (
                  <button
                    key={m}
                    onClick={() => setSelectedModule(m)}
                    className={`p-5 rounded-2xl text-xl font-bold border-2 transition-all ${
                      selectedModule === m
                        ? "border-indigo-500 bg-indigo-500/20 text-white"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-zinc-800 rounded-2xl p-5">
              <p className="text-zinc-400 mb-1 text-sm">FORMAT</p>
              <p className="text-xl font-semibold">10 Questions · 15s each · Ranked</p>
            </div>
            {error && <p className="text-red-400">{error}</p>}
            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] transition-all rounded-2xl p-5 text-xl font-bold disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Room"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // JOIN
  if (mode === "join") {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-14">
          <button onClick={() => { setMode("menu"); setError(""); }} className="text-zinc-400 hover:text-white mb-8">← Back</button>
          <h1 className="text-5xl font-bold mb-10">Join Room</h1>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 space-y-8">
            <div>
              <p className="text-zinc-400 mb-3">Room Code</p>
              <input
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="e.g. AB12CD"
                maxLength={6}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-5 text-3xl font-bold text-center tracking-widest focus:outline-none focus:border-pink-500"
              />
            </div>
            {error && <p className="text-red-400">{error}</p>}
            <button
              onClick={handleJoinRoom}
              disabled={loading || joinCode.length < 6}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] transition-all rounded-2xl p-5 text-xl font-bold disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Room"}
            </button>
          </div>
        </div>
      </main>
    );
  }
 
  // LOBBY
  const isHost = lobbyData?.host === user?.uid;
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-4">Lobby</h1>
        <p className="text-zinc-400 mb-10">Share the code with your opponent</p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 space-y-8">
          <div className="text-center">
            <p className="text-zinc-400 mb-2 text-sm uppercase tracking-widest">Room Code</p>
            <div className="bg-black rounded-2xl px-8 py-6 text-5xl font-black tracking-[0.3em] text-indigo-400">
              {roomCode}
            </div>
          </div>
          <div className="bg-zinc-800 rounded-2xl p-5 flex justify-between">
            <span className="text-zinc-400">Module</span>
            <span className="font-bold">{lobbyData?.module}</span>
          </div>
          <div className="space-y-4">
            <div className="bg-zinc-800 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                {lobbyData?.hostName?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold">{lobbyData?.hostName || "—"}</p>
                <p className="text-zinc-400 text-sm">Host</p>
              </div>
              <div className="ml-auto w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className={`bg-zinc-800 rounded-2xl p-5 flex items-center gap-4 ${!lobbyData?.guest ? "opacity-50" : ""}`}>
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                {lobbyData?.guestName?.charAt(0) || "?"}
              </div>
              <div>
                <p className="font-semibold">{lobbyData?.guestName || "Waiting for opponent..."}</p>
                <p className="text-zinc-400 text-sm">Challenger</p>
              </div>
              {lobbyData?.guest && <div className="ml-auto w-3 h-3 rounded-full bg-green-400" />}
            </div>
          </div>
          {error && <p className="text-red-400">{error}</p>}
          {isHost ? (
            <button
              onClick={handleStartBattle}
              disabled={!lobbyData?.guest}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-5 text-xl font-bold disabled:opacity-40 hover:scale-[1.02] transition-all"
            >
              {lobbyData?.guest ? "Start Battle! ⚔️" : "Waiting for opponent..."}
            </button>
          ) : (
            <div className="w-full bg-zinc-800 rounded-2xl p-5 text-center text-zinc-400">
              Waiting for host to start...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}