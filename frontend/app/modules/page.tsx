"use client";

import Navbar from "../../Components/Navbar";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
export default function ModulesPage() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
    });
    return () => unsub();
  }, []);

  const modules = [
    {
      name: "CS2030S",

      description:
        "Programming Methodology II",

      difficulty: "Intermediate",

      questions: 100,

      color:
        "from-indigo-700 via-blue-700 to-cyan-700",

      icon: "💻",
    },

    {
      name: "CS2040S",

      description:
        "Data Structures & Algorithms",

      difficulty: "Advanced",

      questions: 100,

      color:
        "from-purple-700 via-pink-700 to-rose-700",

      icon: "🧠",
    },
  ];

  function getDifficultyColor(
    difficulty: string
  ) {
    if (difficulty === "Advanced")
      return "text-red-400";

    if (
      difficulty === "Intermediate"
    )
      return "text-yellow-400";

    return "text-green-400";
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-14">
          <h1 className="text-6xl font-bold mb-4">
            Training Arena
          </h1>

          <p className="text-zinc-400 text-xl max-w-3xl">
            Select a module and begin
            competitive practice to gain
            XP, improve rankings and
            dominate the leaderboard.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {modules.map((module) => (
            <button
              key={module.name}
              onClick={() =>
                router.push(
                  `/quiz?module=${module.name}`
                )
              }
              className={`group relative overflow-hidden bg-gradient-to-br ${module.color} rounded-[32px] p-10 text-left transition-all duration-300 hover:scale-[1.02] shadow-2xl`}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-300" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <div className="text-7xl mb-6">
                      {module.icon}
                    </div>

                    <h2 className="text-5xl font-bold mb-4">
                      {module.name}
                    </h2>

                    <p className="text-xl text-zinc-100 max-w-md leading-relaxed">
                      {
                        module.description
                      }
                    </p>
                  </div>

                  <div className="bg-black/30 px-5 py-3 rounded-2xl">
                    <p className="text-sm text-zinc-300 mb-1">
                      DIFFICULTY
                    </p>

                    <p
                      className={`text-lg font-bold ${getDifficultyColor(
                        module.difficulty
                      )}`}
                    >
                      {
                        module.difficulty
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-zinc-200 text-sm mb-1">
                        QUESTION BANK
                      </p>

                      <h3 className="text-3xl font-bold">
                        {
                          module.questions
                        }
                      </h3>
                    </div>

                    <div>
                      <p className="text-zinc-200 text-sm mb-1">
                        MODE
                      </p>

                      <h3 className="text-3xl font-bold">
                        Ranked
                      </h3>
                    </div>
                  </div>

                  <div className="bg-black/30 px-6 py-4 rounded-2xl group-hover:scale-110 transition-all duration-300">
                    <p className="text-xl font-bold">
                      Start →
                    </p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl mb-5">
              ⚡
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Fast Practice
            </h2>

            <p className="text-zinc-400 text-lg">
              Timed quizzes designed for
              rapid improvement.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl mb-5">
              🏆
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Competitive Ranking
            </h2>

            <p className="text-zinc-400 text-lg">
              Earn XP and climb the
              leaderboard.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <div className="text-5xl mb-5">
              🔥
            </div>

            <h2 className="text-3xl font-bold mb-4">
              Daily Streaks
            </h2>

            <p className="text-zinc-400 text-lg">
              Stay consistent and build
              momentum.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}