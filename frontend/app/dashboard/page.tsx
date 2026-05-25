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

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          window.location.href = "/login";
          return;
        }

        const docRef = doc(db, "users", user.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    );

    return () => unsubscribe();
  }, []);

  function getRank(xp: number) {
    if (xp >= 200) return "Bell Curve Destroyer";

    if (xp >= 100) return "Dean's Lister";

    if (xp >= 50) return "TA Slayer";

    return "Freshman";
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="p-10 max-w-6xl mx-auto">
        {userData ? (
          <>
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 p-10 rounded-3xl mb-10 shadow-2xl">
              <h1 className="text-5xl font-bold mb-3">
                Welcome {userData.name}
              </h1>

              <p className="text-xl text-zinc-200">
                Rank: {getRank(userData.xp)}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                <div className="bg-black/30 p-6 rounded-2xl">
                  <p className="text-zinc-300 mb-2">
                    XP
                  </p>

                  <h2 className="text-4xl font-bold">
                    {userData.xp}
                  </h2>
                </div>

                <div className="bg-black/30 p-6 rounded-2xl">
                  <p className="text-zinc-300 mb-2">
                    ELO
                  </p>

                  <h2 className="text-4xl font-bold">
                    {userData.elo}
                  </h2>
                </div>

                <div className="bg-black/30 p-6 rounded-2xl">
                  <p className="text-zinc-300 mb-2">
                    Wins
                  </p>

                  <h2 className="text-4xl font-bold">
                    {userData.wins}
                  </h2>
                </div>

                <div className="bg-black/30 p-6 rounded-2xl">
                  <p className="text-zinc-300 mb-2">
                    Losses
                  </p>

                  <h2 className="text-4xl font-bold">
                    {userData.losses}
                  </h2>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => router.push("/modules")}
                className="bg-zinc-900 hover:bg-indigo-700 transition p-8 rounded-3xl text-left border border-zinc-800"
              >
                <h2 className="text-3xl font-bold mb-3">
                  Start Quiz
                </h2>

                <p className="text-zinc-400">
                  Select module and begin practice.
                </p>
              </button>

              <button
                onClick={() =>
                  router.push("/leaderboard")
                }
                className="bg-zinc-900 hover:bg-purple-700 transition p-8 rounded-3xl text-left border border-zinc-800"
              >
                <h2 className="text-3xl font-bold mb-3">
                  Leaderboard
                </h2>

                <p className="text-zinc-400">
                  Compare rankings with others.
                </p>
              </button>

              <button
                className="bg-zinc-900 hover:bg-pink-700 transition p-8 rounded-3xl text-left border border-zinc-800"
              >
                <h2 className="text-3xl font-bold mb-3">
                  Battle Mode
                </h2>

                <p className="text-zinc-400">
                  Multiplayer battles coming soon.
                </p>
              </button>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </main>
  );
}