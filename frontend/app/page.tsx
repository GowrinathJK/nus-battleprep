"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20" />

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-zinc-800">
        <h1 className="text-3xl font-bold">
          NUS BattlePrep
        </h1>

        <button
          onClick={() =>
            router.push("/login")
          }
          className="bg-indigo-600 hover:bg-indigo-500 transition px-6 py-3 rounded-2xl font-semibold"
        >
          Login
        </button>
      </nav>

      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-5 py-3 mb-8">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

              <p className="text-zinc-300">
                Competitive NUS Learning Platform
              </p>
            </div>

            <h1 className="text-7xl font-black leading-tight mb-8">
              Train.
              <br />
              Compete.
              <br />
              Dominate.
            </h1>

            <p className="text-zinc-400 text-2xl leading-relaxed mb-10 max-w-2xl">
              Practice NUS computing
              modules through ranked
              quizzes, XP progression,
              streak systems and
              competitive leaderboards.
            </p>

            <div className="flex gap-5">
              <button
                onClick={() =>
                  router.push("/login")
                }
                className="bg-indigo-600 hover:bg-indigo-500 transition px-8 py-5 rounded-2xl text-xl font-bold hover:scale-105"
              >
                Start Training
              </button>

              <button
                onClick={() =>
                  router.push(
                    "/leaderboard"
                  )
                }
                className="bg-zinc-900 border border-zinc-800 hover:border-indigo-500 transition px-8 py-5 rounded-2xl text-xl font-bold"
              >
                View Rankings
              </button>
            </div>

            <div className="flex gap-10 mt-14">
              <div>
                <h2 className="text-5xl font-bold text-indigo-400">
                  200+
                </h2>

                <p className="text-zinc-400 mt-2">
                  Practice Questions
                </p>
              </div>

              <div>
                <h2 className="text-5xl font-bold text-green-400">
                  XP
                </h2>

                <p className="text-zinc-400 mt-2">
                  Ranked Progression
                </p>
              </div>

              <div>
                <h2 className="text-5xl font-bold text-orange-400">
                  🔥
                </h2>

                <p className="text-zinc-400 mt-2">
                  Daily Streaks
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-[120px] opacity-20" />

            <div className="relative bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <p className="text-zinc-400 mb-2">
                    CURRENT RANK
                  </p>

                  <h2 className="text-5xl font-bold">
                    Dean's Lister
                  </h2>
                </div>

                <div className="bg-black/40 rounded-3xl px-6 py-5 text-center">
                  <p className="text-zinc-400 text-sm mb-2">
                    STREAK
                  </p>

                  <h2 className="text-4xl font-bold text-orange-400">
                    🔥 12
                  </h2>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-800 rounded-3xl p-6">
                  <div className="flex justify-between mb-3">
                    <p className="text-zinc-400">
                      XP Progress
                    </p>

                    <p className="text-zinc-400">
                      340 XP
                    </p>
                  </div>

                  <div className="w-full bg-black/30 h-5 rounded-full overflow-hidden">
                    <div className="bg-green-400 h-full w-[72%]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-zinc-800 rounded-3xl p-6">
                    <p className="text-zinc-400 mb-3">
                      ELO
                    </p>

                    <h2 className="text-4xl font-bold text-indigo-400">
                      1420
                    </h2>
                  </div>

                  <div className="bg-zinc-800 rounded-3xl p-6">
                    <p className="text-zinc-400 mb-3">
                      Global Rank
                    </p>

                    <h2 className="text-4xl font-bold text-yellow-400">
                      #12
                    </h2>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8">
                  <p className="text-zinc-200 mb-2">
                    NEXT MATCH
                  </p>

                  <h2 className="text-3xl font-bold mb-4">
                    CS2040S Ranked Quiz
                  </h2>

                  <button
                    onClick={() =>
                      router.push(
                        "/modules"
                      )
                    }
                    className="bg-black/30 hover:bg-black/50 transition px-6 py-3 rounded-2xl text-lg font-bold"
                  >
                    Enter Arena →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <div className="text-6xl mb-6">
              ⚔️
            </div>

            <h2 className="text-4xl font-bold mb-5">
              Ranked Battles
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed">
              Compete through timed
              quizzes and climb the
              leaderboard.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <div className="text-6xl mb-6">
              🧠
            </div>

            <h2 className="text-4xl font-bold mb-5">
              Smart Practice
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed">
              Improve through curated
              question banks for NUS
              computing modules.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
            <div className="text-6xl mb-6">
              🏆
            </div>

            <h2 className="text-4xl font-bold mb-5">
              XP Progression
            </h2>

            <p className="text-zinc-400 text-lg leading-relaxed">
              Earn XP, maintain streaks
              and unlock elite ranks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}