"use client";

import { useRouter } from "next/navigation";

import { signOut } from "firebase/auth";

import { auth } from "../firebase";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);

    router.push("/login");
  }

  return (
    <nav className="w-full bg-zinc-950 border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
      <div
        onClick={() => router.push("/dashboard")}
        className="text-2xl font-bold cursor-pointer hover:text-indigo-400 transition"
      >
        NUS BattlePrep
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => router.push("/quiz")}
          className="hover:text-indigo-400 transition"
        >
          Quiz
        </button>

        <button
          onClick={() => router.push("/leaderboard")}
          className="hover:text-indigo-400 transition"
        >
          Leaderboard
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-xl hover:scale-105 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}