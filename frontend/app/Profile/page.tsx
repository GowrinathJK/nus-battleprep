"use client";

import { useEffect, useState } from "react";

import Navbar from "../../Components/Navbar";

import { auth, db } from "../../firebase";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

export default function ProfilePage() {
  const [userData, setUserData] =
    useState<any>(null);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (!user) return;

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

  if (!userData) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <div className="flex items-center justify-center h-[80vh]">
          <p className="text-2xl">
            Loading Profile...
          </p>
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
                {userData.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div>
                <p className="text-zinc-200 text-lg mb-2">
                  PLAYER PROFILE
                </p>

                <h1 className="text-6xl font-black mb-4">
                  {userData.name}
                </h1>

                <div className="inline-flex items-center gap-3 bg-black/30 px-5 py-3 rounded-2xl">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                  <p className="text-xl font-bold">
                    {getRank(
                      userData.xp
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-3xl p-8 text-center min-w-[220px]">
              <p className="text-zinc-300 text-sm mb-3">
                TOTAL XP
              </p>

              <h2 className="text-6xl font-black text-green-400">
                {userData.xp}
              </h2>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">
              ELO RATING
            </p>

            <h2 className="text-5xl font-bold text-indigo-400">
              {userData.elo}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">
              WINS
            </p>

            <h2 className="text-5xl font-bold text-green-400">
              {userData.wins}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-3">
              DAILY STREAK
            </p>

            <h2 className="text-5xl font-bold text-orange-400">
              🔥 {userData.streak}
            </h2>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 mb-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">
              Achievement Showcase
            </h2>

            <p className="text-zinc-400">
              Milestones unlocked through
              practice.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-zinc-800 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-5">
                🥇
              </div>

              <h3 className="text-2xl font-bold mb-3">
                First Quiz
              </h3>

              <p className="text-zinc-400">
                Completed your first quiz.
              </p>
            </div>

            <div className="bg-zinc-800 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-5">
                🔥
              </div>

              <h3 className="text-2xl font-bold mb-3">
                Streak Builder
              </h3>

              <p className="text-zinc-400">
                Maintained consistency.
              </p>
            </div>

            <div className="bg-zinc-800 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-5">
                🧠
              </div>

              <h3 className="text-2xl font-bold mb-3">
                100 XP
              </h3>

              <p className="text-zinc-400">
                Reached 100 XP.
              </p>
            </div>

            <div className="bg-zinc-800 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-5">
                👑
              </div>

              <h3 className="text-2xl font-bold mb-3">
                Elite Rank
              </h3>

              <p className="text-zinc-400">
                Achieved elite status.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          <h2 className="text-4xl font-bold mb-8">
            Recent Activity
          </h2>

          <div className="space-y-5">
            <div className="bg-zinc-800 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  CS2030S Ranked Quiz
                </h3>

                <p className="text-zinc-400">
                  Completed module practice.
                </p>
              </div>

              <div className="text-right">
                <p className="text-green-400 text-3xl font-bold">
                  +50 XP
                </p>

                <p className="text-zinc-400">
                  Today
                </p>
              </div>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Daily Streak Updated
                </h3>

                <p className="text-zinc-400">
                  Consistency maintained.
                </p>
              </div>

              <div className="text-right">
                <p className="text-orange-400 text-3xl font-bold">
                  🔥 +1
                </p>

                <p className="text-zinc-400">
                  Today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}