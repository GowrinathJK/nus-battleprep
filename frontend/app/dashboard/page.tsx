"use client";

import { useEffect, useState } from "react";

import { auth, db } from "../../firebase";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { useRouter } from "next/navigation";

import Navbar from "../../Components/Navbar";

export default function DashboardPage() {
  const router = useRouter();

  const [userData, setUserData] =
    useState<any>(null);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) {
            window.location.href =
              "/login";

            return;
          }

          const docRef = doc(
            db,
            "users",
            user.uid
          );

          const docSnap =
            await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(
              docSnap.data()
            );
          }
        }
      );

    return () => unsubscribe();
  }, []);

  function getRank(xp: number) {
    if (xp >= 500)
      return "Legend";

    if (xp >= 250)
      return "Bell Curve Destroyer";

    if (xp >= 100)
      return "Dean's Lister";

    if (xp >= 50)
      return "TA Slayer";

    return "Freshman";
  }

  function getProgressWidth(xp: number) {
    return `${Math.min(
      (xp % 100) * 1,
      100
    )}%`;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 py-10">
        {userData ? (
          <>
            <div className="grid lg:grid-cols-3 gap-8 mb-10">
              <div className="lg:col-span-2 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 rounded-3xl p-10 border border-indigo-500 shadow-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-zinc-200 mb-2 text-lg">
                      Welcome back
                    </p>

                    <h1 className="text-6xl font-bold mb-4">
                      {userData.name}
                    </h1>

                    <div className="inline-flex items-center gap-3 bg-black/30 px-5 py-3 rounded-2xl">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                      <p className="text-xl font-semibold">
                        {getRank(
                          userData.xp
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="bg-black/30 p-6 rounded-3xl text-center min-w-[140px]">
                    <p className="text-zinc-300 text-sm mb-2">
                      DAILY STREAK
                    </p>

                    <h2 className="text-5xl font-bold text-orange-400">
                      🔥
                    </h2>

                    <p className="text-4xl font-bold mt-2">
                      {
                        userData.streak
                      }
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="flex justify-between mb-3">
                    <p className="text-zinc-200">
                      XP Progress
                    </p>

                    <p className="text-zinc-200">
                      {userData.xp} XP
                    </p>
                  </div>

                  <div className="w-full bg-black/30 rounded-full h-5 overflow-hidden">
                    <div
                      className="bg-green-400 h-full rounded-full transition-all duration-700"
                      style={{
                        width:
                          getProgressWidth(
                            userData.xp
                          ),
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-8">
                  Performance
                </h2>

                <div className="space-y-5">
                  <div className="bg-zinc-800 rounded-2xl p-5 flex justify-between items-center">
                    <p className="text-zinc-300">
                      XP
                    </p>

                    <h3 className="text-3xl font-bold">
                      {userData.xp}
                    </h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-5 flex justify-between items-center">
                    <p className="text-zinc-300">
                      ELO
                    </p>

                    <h3 className="text-3xl font-bold text-indigo-400">
                      {userData.elo}
                    </h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-5 flex justify-between items-center">
                    <p className="text-zinc-300">
                      Wins
                    </p>

                    <h3 className="text-3xl font-bold text-green-400">
                      {
                        userData.wins
                      }
                    </h3>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-5 flex justify-between items-center">
                    <p className="text-zinc-300">
                      Losses
                    </p>

                    <h3 className="text-3xl font-bold text-red-400">
                      {
                        userData.losses
                      }
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <button
                onClick={() =>
                  router.push(
                    "/modules"
                  )
                }
                className="group bg-zinc-900 border border-zinc-800 hover:border-indigo-500 rounded-3xl p-8 text-left transition-all hover:scale-[1.02] hover:bg-indigo-900/20"
              >
                <div className="text-6xl mb-6">
                  🎯
                </div>

                <h2 className="text-4xl font-bold mb-4">
                  Start Quiz
                </h2>

                <p className="text-zinc-400 text-lg">
                  Practice modules,
                  gain XP and improve
                  rankings.
                </p>
              </button>

              <button
                onClick={() =>
                  router.push(
                    "/leaderboard"
                  )
                }
                className="group bg-zinc-900 border border-zinc-800 hover:border-purple-500 rounded-3xl p-8 text-left transition-all hover:scale-[1.02] hover:bg-purple-900/20"
              >
                <div className="text-6xl mb-6">
                  🏆
                </div>

                <h2 className="text-4xl font-bold mb-4">
                  Leaderboard
                </h2>

                <p className="text-zinc-400 text-lg">
                  Compete against other
                  students.
                </p>
              </button>

              <button
                onClick={() =>
                  router.push("/battle")
                }
                className="group bg-zinc-900 border border-zinc-800 hover:border-pink-500 rounded-3xl p-8 text-left transition-all hover:scale-[1.02] hover:bg-pink-900/20"
              >
                <div className="text-6xl mb-6">
                  ⚔️
                </div>

                <h2 className="text-4xl font-bold mb-4">
                  Battle Mode
                </h2>

                <p className="text-zinc-400 text-lg">
                  Real-time ranked battles
                  against other students.
                </p>
              </button>
            </div>

            <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">
                  Achievements
                </h2>

                <p className="text-zinc-400">
                  Unlock rewards by
                  practicing.
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-4">
                    🥇
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    First Quiz
                  </h3>

                  <p className="text-zinc-400 text-sm">
                    Complete your first
                    quiz.
                  </p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-4">
                    🔥
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    5 Day Streak
                  </h3>

                  <p className="text-zinc-400 text-sm">
                    Maintain consistency.
                  </p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-4">
                    🧠
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    100 XP
                  </h3>

                  <p className="text-zinc-400 text-sm">
                    Reach 100 XP.
                  </p>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-4">
                    👑
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    Elite Rank
                  </h3>

                  <p className="text-zinc-400 text-sm">
                    Become top ranked.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[70vh]">
            <p className="text-2xl">
              Loading Dashboard...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}