type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({
  current,
  total,
}: ProgressBarProps) {

  return (
    <div className="mb-8">

      <div className="mb-2 flex justify-between text-sm text-gray-300">

        <span>
          Progress
        </span>

        <span>
          {current} / {total}
        </span>

      </div>

      <div className="h-3 rounded-full bg-black/30">

        <div
          className="h-3 rounded-full bg-purple-500 transition-all duration-500"
          style={{
            width: `${(current / total) * 100}%`,
          }}
        />

      </div>

    </div>
  );
}