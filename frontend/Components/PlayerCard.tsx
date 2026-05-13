type PlayerCardProps = {
  name: string;
  score: number;
  rank: string;
  borderColor: string;
};

export default function PlayerCard({
  name,
  score,
  rank,
  borderColor,
}: PlayerCardProps) {

  return (
    <div
      className={`rounded-3xl border ${borderColor} bg-white/10 p-8 backdrop-blur-md`}
    >

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-3xl font-bold">
          {name}
        </h2>

        <span className="rounded-full bg-green-500/20 px-4 py-1 text-green-300">
          Online
        </span>

      </div>

      <div className="space-y-4">

        <div>

          <p className="text-gray-400">
            Score
          </p>

          <h3 className="text-5xl font-extrabold">
            {score}
          </h3>

        </div>

        <div>

          <p className="text-gray-400">
            Rank
          </p>

          <h3 className="text-2xl font-bold text-purple-300">
            {rank}
          </h3>

        </div>

      </div>

    </div>
  );
}