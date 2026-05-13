import Navbar from "../Components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white">
      
      <Navbar />

      <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">

        <div className="mb-6 rounded-full border border-purple-500 bg-purple-500/20 px-6 py-2 text-sm text-purple-300 backdrop-blur-md">
          Competitive Quiz Battles for NUS Students
        </div>

        <h1 className="mb-6 text-6xl font-extrabold leading-tight md:text-7xl">
          NUS <span className="text-purple-400">BattlePrep</span>
        </h1>

        <p className="mb-10 max-w-2xl text-xl text-gray-300">
          Challenge your friends, revise smarter, and dominate the leaderboard through real-time quiz battles.
        </p>

        <div className="flex flex-wrap justify-center gap-6">

          <Link href="/battle">
            <button className="rounded-2xl bg-purple-600 px-8 py-4 text-lg font-bold shadow-lg shadow-purple-500/40 transition hover:scale-105 hover:bg-purple-500">
              ⚔️ Start Battle
            </button>
          </Link>

          <Link href="/leaderboard">
            <button className="rounded-2xl border border-purple-400 bg-white/10 px-8 py-4 text-lg font-bold backdrop-blur-md transition hover:scale-105 hover:bg-white/20">
              🏆 Leaderboard
            </button>
          </Link>

        </div>

        {/* Floating cards */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <h2 className="mb-3 text-2xl font-bold">🔥 Live Battles</h2>
            <p className="text-gray-300">
              Compete with friends in real-time revision matches.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <h2 className="mb-3 text-2xl font-bold">🧠 Smart Revision</h2>
            <p className="text-gray-300">
              Discover weak topics and improve strategically.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <h2 className="mb-3 text-2xl font-bold">📈 Climb Ranks</h2>
            <p className="text-gray-300">
              Earn XP and dominate the leaderboard.
            </p>
          </div>

        </div>

      </section>
    </main>
  );
}