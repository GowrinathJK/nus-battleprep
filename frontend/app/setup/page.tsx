"use client";

import Navbar from "../../Components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

const modules = [
  "CS2030S",
  "CS2040S",
];

const difficulties = [
  "Easy",
  "Medium",
  "Hard",
];

export default function SetupPage() {

  const router = useRouter();

  const [selectedModule, setSelectedModule] =
    useState("");

  const [selectedDifficulty, setSelectedDifficulty] =
    useState("");

  function handleCreateBattle() {

    if (!selectedModule || !selectedDifficulty) {

      alert("Please select module and difficulty.");

      return;
    }

    router.push("/battle");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white">

      <Navbar />

      <section className="p-8">

        {/* Header */}
        <div className="mb-12 text-center">

          <h1 className="mb-4 text-6xl font-extrabold">
            Battle Setup ⚔️
          </h1>

          <p className="text-xl text-gray-300">
            Choose your module and difficulty.
          </p>

        </div>

        {/* Module Selection */}
        <div className="mb-14">

          <h2 className="mb-6 text-3xl font-bold">
            Select Module
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            {modules.map((module) => (

              <button
                key={module}
                onClick={() => setSelectedModule(module)}
                className={`rounded-3xl border p-8 text-left text-2xl font-bold transition

                ${
                  selectedModule === module
                    ? "border-purple-400 bg-purple-500/30"
                    : "border-white/10 bg-white/10 hover:border-purple-400 hover:bg-purple-500/20"
                }
                `}
              >
                {module}
              </button>

            ))}

          </div>

        </div>

        {/* Difficulty Selection */}
        <div className="mb-14">

          <h2 className="mb-6 text-3xl font-bold">
            Select Difficulty
          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            {difficulties.map((difficulty) => (

              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`rounded-3xl border p-6 text-xl font-bold transition

                ${
                  selectedDifficulty === difficulty
                    ? "border-purple-400 bg-purple-500/30"
                    : "border-white/10 bg-white/10 hover:border-purple-400 hover:bg-purple-500/20"
                }
                `}
              >
                {difficulty}
              </button>

            ))}

          </div>

        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-6">

          <button
            onClick={handleCreateBattle}
            className="rounded-2xl bg-purple-600 px-8 py-4 text-lg font-bold transition hover:bg-purple-500"
          >
            ⚔️ Create Battle
          </button>

          <button
            className="rounded-2xl border border-white/10 bg-white/10 px-8 py-4 text-lg font-bold transition hover:border-purple-400 hover:bg-purple-500/20"
          >
            🎯 Join Room
          </button>

        </div>

      </section>

    </main>
  );
}