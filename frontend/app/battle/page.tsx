"use client";

import { useEffect, useState } from "react";

import Navbar from "../../Components/Navbar";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function BattlePage() {
  const [players, setPlayers] =
    useState<any[]>([]);

  useEffect(() => {
    async function fetchPlayers() {
      const q = query(
        collection(db, "users"),
        orderBy("xp", "desc"),
        limit(2)
      );

      const querySnapshot =
        await getDocs(q);

      const fetchedPlayers =
        querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setPlayers(fetchedPlayers);
    }

    fetchPlayers();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-pink-500/10 blur-[150px]" />

        <div className="relative z-10 mb-14">
          <h1 className="text-7xl font-black mb-5">
            Battle Arena
          </h1>

          <p className="text-zinc-400 text-2xl max-w-3xl">
            Enter ranked real-time
            battles and compete against
            other NUS students.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10">
            <div className="flex justify-between items-center mb-10">
              <div>
                <p className="text-zinc-400 mb-2">
                  YOUR STATUS
                </p>

                <h2 className="text-5xl font-bold">
                  Ready
                </h2>
              </div>

              <div className="w-5 h-5 rounded-full bg-green-400 animate-pulse" />
            </div>

            <div className="space-y-6">
              <div className="bg-zinc-800 rounded-3xl p-6">
                <p className="text-zinc-400 mb-3">
                  Match Type
                </p>

                <h2 className="text-3xl font-bold">
                  Ranked 1v1
                </h2>
              </div>

              <div className="bg-zinc-800 rounded-3xl p-6">
                <p className="text-zinc-400 mb-3">
                  Queue Time
                </p>

                <h2 className="text-3xl font-bold text-yellow-400">
                  ~15 Seconds
                </h2>
              </div>

              <div className="bg-zinc-800 rounded-3xl p-6">
                <p className="text-zinc-400 mb-3">
                  Potential Reward
                </p>

                <h2 className="text-3xl font-bold text-green-400">
                  +50 XP
                </h2>
              </div>
            </div>

            <button className="w-full mt-10 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] transition-all duration-300 rounded-3xl p-6 text-2xl font-bold">
              Find Match
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10">
            <h2 className="text-4xl font-bold mb-10">
              Live Match Preview
            </h2>

            {players.length >= 2 ? (
              <>
                <div className="space-y-6">
                  <div className="bg-zinc-800 rounded-3xl p-6 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold">
                        {players[0].name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold">
                          {players[0].name}
                        </h3>

                        <p className="text-zinc-400">
                          ELO:{" "}
                          {
                            players[0].elo
                          }
                        </p>
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold text-green-400">
                      {
                        players[0].xp
                      }{" "}
                      XP
                    </h2>
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-pink-600 px-6 py-3 rounded-2xl text-2xl font-black">
                      VS
                    </div>
                  </div>

                  <div className="bg-zinc-800 rounded-3xl p-6 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold">
                        {players[1].name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold">
                          {players[1].name}
                        </h3>

                        <p className="text-zinc-400">
                          ELO:{" "}
                          {
                            players[1].elo
                          }
                        </p>
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold text-green-400">
                      {
                        players[1].xp
                      }{" "}
                      XP
                    </h2>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-zinc-800 rounded-3xl p-10 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Not Enough Players
                </h2>

                <p className="text-zinc-400">
                  Add more users to
                  Firebase to simulate
                  matchmaking.
                </p>
              </div>
            )}

            <div className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8">
              <p className="text-zinc-200 mb-3">
                TRENDING MODE
              </p>

              <h2 className="text-4xl font-bold mb-4">
                CS2040S Ranked
              </h2>

              <p className="text-zinc-100 text-lg">
                Most active competitive
                queue this week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}