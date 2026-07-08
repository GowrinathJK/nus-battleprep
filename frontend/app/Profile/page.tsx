"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
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
      if (docSnap.exists()) setUserData(docSnap.data());

      const matchQuery = query(collection(db, "matches"), where("host", "==", user.uid));
      const matchQuery2 = query(collection(db, "matches"), where("guest", "==", user.uid));
      const [hostSnap, guestSnap] = await Promise.all([getDocs(matchQuery), getDocs(matchQuery2)]);

      const allMatches = [
        ...hostSnap.docs.map(d => ({ id: d.id, ...d.data() })),
        ...guestSnap.docs.map(d => ({ id: d.id, ...d.data() })),
      ].sort((a: any, b: any) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());

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
    if (match.host === currentUid) return match.guestName;
    return match.hostName;
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
                  <p className="text-xl font-bold">{getRank(userData.xp)}</p>
                </div>
              </div>
            </div>
            <div className="bg-black/30 rounded-3xl p-8 text-center min-w-[220px]">
              <p className="text-zinc-300 text-sm mb-3">TOTAL XP</p>
              <h2 className="text-6xl font-black text-green-400">{userData.xp}</h2>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">ELO RATING</p>
            <h2 className="text-5xl font-bold text-indigo-400">{userData.elo}</h2>
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

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 mb-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Achievement Showcase</h2>
            <p className="text-zinc-400">Milestones unlocked through practice.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className={`rounded-3xl p-8 text-center ${(userData.xp ?? 0) >= 10 ? "bg-indigo-900/40 border border-indigo-500" : "bg-zinc-800 opacity-40"}`}>
              <div className="text-6xl mb-5">🥇</div>
              <h3 className="text-2xl font-bold mb-3">First Quiz</h3>
              <p className="text-zinc-400">Completed your first quiz.</p>
            </div>
            <div className={`rounded-3xl p-8 text-center ${(userData.streak ?? 0) >= 3 ? "bg-orange-900/40 border border-orange-500" : "bg-zinc-800 opacity-40"}`}>
              <div className="text-6xl mb-5">🔥</div>
              <h3 className="text-2xl font-bold mb-3">Streak Builder</h3>
              <p className="text-zinc-400">3 day streak maintained.</p>
            </div>
            <div className={`rounded-3xl p-8 text-center ${(userData.xp ?? 0) >= 100 ? "bg-purple-900/40 border border-purple-500" : "bg-zinc-800 opacity-40"}`}>
              <div className="text-6xl mb-5">🧠</div>
              <h3 className="text-2xl font-bold mb-3">100 XP</h3>
              <p className="text-zinc-400">Reached 100 XP.</p>
            </div>
            <div className={`rounded-3xl p-8 text-center ${(userData.wins ?? 0) >= 1 ? "bg-yellow-900/40 border border-yellow-500" : "bg-zinc-800 opacity-40"}`}>
              <div className="text-6xl mb-5">👑</div>
              <h3 className="text-2xl font-bold mb-3">First Win</h3>
              <p className="text-zinc-400">Won your first battle.</p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          <h2 className="text-4xl font-bold mb-8">Match History</h2>
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
                      <span className={`text-2xl font-black ${result.color}`}>{result.label}</span>
                      <div>
                        <p className="text-xl font-bold">vs {getOpponentName(match)}</p>
                        <p className="text-zinc-400">{match.module} · {new Date(match.playedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{getMyScore(match)} — {getOppScore(match)}</p>
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