"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../../firebase";

import Navbar from "../../Components/Navbar";

export default function LeaderboardPage() {
  const router = useRouter();

  const [users, setUsers] =
    useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchLeaderboard() {
      const q = query(
        collection(db, "users"),
        orderBy("xp", "desc")
      );

      const querySnapshot =
        await getDocs(q);

      const leaderboardUsers =
        querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setUsers(leaderboardUsers);
    }

    fetchLeaderboard();
  }, []);

  function getMedal(index: number) {
    if (index === 0) return "🥇";

    if (index === 1) return "🥈";

    if (index === 2) return "🥉";

    return "🎯";
  }

  function getCardStyle(index: number) {
    if (index === 0)
      return "from-yellow-500/20 to-yellow-700/10 border-yellow-500";

    if (index === 1)
      return "from-zinc-300/10 to-zinc-500/10 border-zinc-400";

    if (index === 2)
      return "from-orange-500/20 to-orange-700/10 border-orange-500";

    return "from-zinc-900 to-zinc-900 border-zinc-800";
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4">
            Leaderboard
          </h1>

          <p className="text-zinc-400 text-xl">
            Compete against other
            students and climb the
            rankings.
          </p>
        </div>

        <div className="space-y-5">
          {users.map((user, index) => (
            <div
              key={user.id}
              className={`bg-gradient-to-r ${getCardStyle(
                index
              )} border rounded-3xl p-8 flex items-center justify-between hover:scale-[1.01] transition-all duration-300`}
            >
              <div className="flex items-center gap-8">
                <div className="text-6xl">
                  {getMedal(index)}
                </div>

                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="text-3xl font-bold">
                      #{index + 1}
                    </h2>

                    <h2 className="text-3xl font-bold">
                      {user.name}
                    </h2>
                  </div>

                  <div className="flex gap-6 text-zinc-400">
                    <p>
                      🔥{" "}
                      {user.streak} Day
                      Streak
                    </p>

                    <p>
                      ⚔️ ELO:{" "}
                      {user.elo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-zinc-400 mb-2">
                  TOTAL XP
                </p>

                <h2 className="text-5xl font-bold text-green-400">
                  {user.xp}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center mt-10">
            <div className="text-7xl mb-6">
              🏆
            </div>

            <h2 className="text-4xl font-bold mb-4">
              No Rankings Yet
            </h2>

            <p className="text-zinc-400 text-lg">
              Complete quizzes to appear
              on the leaderboard.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}