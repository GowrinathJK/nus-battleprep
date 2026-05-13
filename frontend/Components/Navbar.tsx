import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-white/10 bg-black/30 px-8 py-5 text-white backdrop-blur-md">

      {/* Logo */}
      <Link href="/">
        <h1 className="cursor-pointer text-3xl font-extrabold tracking-wide">
          NUS <span className="text-purple-400">BattlePrep</span>
        </h1>
      </Link>

      {/* Navigation */}
      <ul className="flex items-center gap-8 text-lg font-medium text-gray-300">

        <li>
          <Link
            href="/login"
            className="transition hover:text-purple-400"
          >
            Login
          </Link>
        </li>

        <li>
          <Link
            href="/dashboard"
            className="transition hover:text-purple-400"
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            href="/leaderboard"
            className="transition hover:text-purple-400"
          >
            Leaderboard
          </Link>
        </li>

        <li>
          <Link
            href="/setup"
            className="rounded-xl bg-purple-600 px-5 py-2 text-white shadow-lg shadow-purple-500/40 transition hover:scale-105 hover:bg-purple-500"
          >
            Start Battle
          </Link>
        </li>

      </ul>
    </nav>
  );
}