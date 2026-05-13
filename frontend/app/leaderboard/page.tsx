import Navbar from "../../Components/Navbar";

const leaderboardData = [
  {
    rank: 1,
    username: "ShadowByte",
    xp: 2840,
    tier: "Diamond",
  },

  {
    rank: 2,
    username: "CodeTitan",
    xp: 2610,
    tier: "Platinum",
  },

  {
    rank: 3,
    username: "AlgoKnight",
    xp: 2480,
    tier: "Gold",
  },

  {
    rank: 4,
    username: "BinaryWizard",
    xp: 2320,
    tier: "Silver",
  },

  {
    rank: 5,
    username: "NullPointer",
    xp: 2200,
    tier: "Silver",
  },
];

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white">

      <Navbar />

      <section className="p-8">

        {/* Header */}
        <div className="mb-12 text-center">

          <h1 className="mb-4 text-6xl font-extrabold">
            Leaderboard 🏆
          </h1>

          <p className="text-xl text-gray-300">
            Battle harder. Climb higher.
          </p>

        </div>

        {/* Top Players */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">

          {leaderboardData.slice(0, 3).map((player) => (

            <div
              key={player.rank}
              className={`rounded-3xl border bg-white/10 p-8 text-center backdrop-blur-md transition hover:scale-105

              ${
                player.rank === 1
                  ? "border-yellow-400 shadow-lg shadow-yellow-500/20"
                  : player.rank === 2
                  ? "border-gray-300 shadow-lg shadow-gray-400/20"
                  : "border-orange-400 shadow-lg shadow-orange-500/20"
              }
              `}
            >

              {/* Medal */}
              <div className="mb-4 text-6xl">
                {player.rank === 1
                  ? "🥇"
                  : player.rank === 2
                  ? "🥈"
                  : "🥉"}
              </div>

              {/* Username */}
              <h2 className="mb-2 text-3xl font-bold">
                {player.username}
              </h2>

              {/* Rank */}
              <p className="mb-6 text-gray-300">
                Global Rank #{player.rank}
              </p>

              {/* XP */}
              <div className="mb-4 rounded-2xl bg-black/30 p-4">

                <p className="mb-1 text-sm text-gray-400">
                  XP
                </p>

                <h3 className="text-3xl font-extrabold text-purple-300">
                  {player.xp}
                </h3>

              </div>

              {/* Tier */}
              <div className="rounded-2xl bg-purple-500/20 p-4">

                <p className="mb-1 text-sm text-gray-400">
                  Rank Tier
                </p>

                <h3 className="text-2xl font-bold">
                  {player.tier}
                </h3>

              </div>

            </div>

          ))}

        </div>

        {/* Other Players */}
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">

          <h2 className="mb-8 text-3xl font-bold">
            Global Rankings
          </h2>

          <div className="space-y-5">

            {leaderboardData.slice(3).map((player) => (

              <div
                key={player.rank}
                className="flex items-center justify-between rounded-2xl bg-black/30 p-5 transition hover:bg-purple-500/20"
              >

                {/* Left */}
                <div className="flex items-center gap-6">

                  <div className="text-3xl font-extrabold text-purple-300">
                    #{player.rank}
                  </div>

                  <div>

                    <h3 className="text-2xl font-bold">
                      {player.username}
                    </h3>

                    <p className="text-gray-400">
                      Competitive Challenger
                    </p>

                  </div>

                </div>

                {/* Right */}
                <div className="flex gap-4">

                  <div className="rounded-xl bg-purple-500/20 px-4 py-2 font-bold">
                    XP: {player.xp}
                  </div>

                  <div className="rounded-xl bg-blue-500/20 px-4 py-2 font-bold">
                    {player.tier}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}