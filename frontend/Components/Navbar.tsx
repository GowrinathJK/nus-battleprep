"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });
    return () => unsub();
  }, []);

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
        <button onClick={() => router.push("/modules")} className="hover:text-indigo-400 transition">
          Practice
        </button>
        <button onClick={() => router.push("/battle")} className="hover:text-pink-400 transition font-semibold">
          ⚔️ Battle
        </button>
        <button onClick={() => router.push("/leaderboard")} className="hover:text-indigo-400 transition">
          Leaderboard
        </button>
        <button onClick={() => router.push("/Profile")} className="hover:text-indigo-400 transition">
          Profile
        </button>
        {loggedIn && (
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-xl hover:scale-105 transition">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}