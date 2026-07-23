"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import Navbar from "../../Components/Navbar";

export default function LeaderboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<"elo" | "xp">("elo");
  const [filterModule, setFilterModule] = useState<"all" | "CS2030S" | "CS2040S">("all");
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      // only fetch after confirming user is signed in
      const snap = await getDocs(collection(db, "users"));
      const allUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(allUsers);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchMatches() {
      if (filterModule === "all") { setMatches([]); return; }
      const q = query(collection(db, "matches"), where("module", "==", filterModule));
      const snap = await getDocs(q);
      setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    fetchMatches();
  }, [filterModule]);

  function getModuleStats(userId: string) {
    const userMatches = matches.filter(m => m.host === userId || m.guest === userId);
    const wins = userMatches.filter(m => m.winner === userId).length;
    const total = userMatches.length;
    return { wins, total };
  }

  const displayUsers = [...users].sort((a, b) => {
    if (filterModule !== "all") {
      return getModuleStats(b.id).wins - getModuleStats(a.id).wins;
    }
    if (sortBy === "elo") return (b.elo ?? 1000) - (a.elo ?? 1000);
    return (b.xp ?? 0) - (a.xp ?? 0);
  });

  function getMedal(index: number) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return "🎯";
  }

  function getCardStyle(index: number) {
    if (index === 0) return "from-yellow-500/20 to-yellow-700/10 border-yellow-500";
    if (index === 1) return "from-zinc-300/10 to-zinc-500/10 border-zinc-400";
    if (index === 2) return "from-orange-500/20 to-orange-700/10 border-orange-500";
    return "from-zinc-900 to-zinc-900 border-zinc-800";
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-6xl font-bold mb-4">Leaderboard</h1>
          <p className="text-zinc-400 text-xl">Compete against other students and climb the rankings.</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex gap-3">
            <button
              onClick={() => setFilterModule("all")}
              className={`px-5 py-3 rounded-2xl font-bold transition-all ${filterModule === "all" ? "bg-zinc-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
            >
              🌐 All
            </button>
            <button
              onClick={() => setFilterModule("CS2030S")}
              className={`px-5 py-3 rounded-2xl font-bold transition-all ${filterModule === "CS2030S" ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
            >
              💻 CS2030S
            </button>
            <button
              onClick={() => setFilterModule("CS2040S")}
              className={`px-5 py-3 rounded-2xl font-bold transition-all ${filterModule === "CS2040S" ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
            >
              🧠 CS2040S
            </button>
          </div>

          {filterModule === "all" && (
            <div className="flex gap-3 ml-auto">
              <button
                onClick={() => setSortBy("elo")}
                className={`px-5 py-3 rounded-2xl font-bold transition-all ${sortBy === "elo" ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
              >
                ⚔️ ELO
              </button>
              <button
                onClick={() => setSortBy("xp")}
                className={`px-5 py-3 rounded-2xl font-bold transition-all ${sortBy === "xp" ? "bg-green-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
              >
                ⭐ XP
              </button>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {displayUsers.map((user, index) => {
            const moduleStats = filterModule !== "all" ? getModuleStats(user.id) : null;
            return (
              <div
                key={user.id}
                className={`bg-gradient-to-r ${getCardStyle(index)} border rounded-3xl p-8 flex items-center justify-between hover:scale-[1.01] transition-all duration-300`}
              >
                <div className="flex items-center gap-8">
                  <div className="text-6xl">{getMedal(index)}</div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-3xl font-bold">#{index + 1}</h2>
                      <h2 className="text-3xl font-bold">{user.name}</h2>
                    </div>
                    <div className="flex gap-6 text-zinc-400">
                      <p>🔥 {user.streak ?? 0} Day Streak</p>
                      <p>⚔️ ELO: {user.elo ?? 1000}</p>
                      <p>🏆 Wins: {user.wins ?? 0}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {filterModule !== "all" && moduleStats ? (
                    <>
                      <p className="text-zinc-400 mb-2">{filterModule} WINS</p>
                      <h2 className="text-5xl font-bold text-indigo-400">{moduleStats.wins}</h2>
                      <p className="text-zinc-400 text-sm">{moduleStats.total} battles</p>
                    </>
                  ) : sortBy === "elo" ? (
                    <>
                      <p className="text-zinc-400 mb-2">ELO RATING</p>
                      <h2 className="text-5xl font-bold text-indigo-400">{user.elo ?? 1000}</h2>
                    </>
                  ) : (
                    <>
                      <p className="text-zinc-400 mb-2">TOTAL XP</p>
                      <h2 className="text-5xl font-bold text-green-400">{user.xp ?? 0}</h2>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {displayUsers.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center mt-10">
            <div className="text-7xl mb-6">🏆</div>
            <h2 className="text-4xl font-bold mb-4">No Rankings Yet</h2>
            <p className="text-zinc-400 text-lg">Complete quizzes to appear on the leaderboard.</p>
          </div>
        )}
      </div>
    </main>
  );
}