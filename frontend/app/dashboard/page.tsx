import Navbar from "../../Components/Navbar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white">

      <Navbar />

      <section className="p-8">

        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="mb-2 text-5xl font-extrabold">
            Welcome Back
          </h1>

          <p className="text-lg text-gray-300">
            Ready to dominate today’s battles?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-14 flex flex-wrap gap-6">

          <button className="rounded-2xl bg-purple-600 px-8 py-4 text-lg font-bold shadow-lg shadow-purple-500/40 transition hover:scale-105 hover:bg-purple-500">
            ⚔️ Start Battle
          </button>

          <button className="rounded-2xl border border-purple-400 bg-white/10 px-8 py-4 text-lg font-bold backdrop-blur-md transition hover:scale-105 hover:bg-white/20">
            🎯 Join Room
          </button>

        </div>

        {/* Stats Cards */}
        <div className="mb-14 grid gap-8 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
            <h2 className="mb-3 text-2xl font-bold text-purple-300">
              XP
            </h2>

            <p className="text-5xl font-extrabold">
              1240
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
            <h2 className="mb-3 text-2xl font-bold text-purple-300">
              Rank
            </h2>

            <p className="text-5xl font-extrabold">
              Gold II
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
            <h2 className="mb-3 text-2xl font-bold text-purple-300">
              Wins
            </h2>

            <p className="text-5xl font-extrabold">
              28
            </p>
          </div>

        </div>

        {/* Recent Battles */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">

          <h2 className="mb-6 text-3xl font-bold">
            Recent Battles
          </h2>

          <div className="space-y-4">

            <div className="flex items-center justify-between rounded-2xl bg-black/30 p-5">
              <div>
                <h3 className="text-xl font-bold">
                  Quiz Battle
                </h3>

                <p className="text-gray-400">
                  Victory
                </p>
              </div>

              <span className="font-bold text-green-400">
                +25 XP
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-black/30 p-5">
              <div>
                <h3 className="text-xl font-bold">
                  Ranked Match
                </h3>

                <p className="text-gray-400">
                  Defeat
                </p>
              </div>

              <span className="font-bold text-red-400">
                -10 XP
              </span>
            </div>

          </div>

        </div>

      </section>
    </main>
  );
}