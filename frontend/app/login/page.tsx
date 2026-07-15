"use client";

import { useRouter } from "next/navigation";
import { signInWithGoogle, handleGoogleRedirect } from "../../auth";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // handle redirect result when coming back from Google
    handleGoogleRedirect().then((user) => {
      if (user) router.push("/dashboard");
    });
  }, []);

  async function handleLogin() {
    setLoading(true);
    const user = await signInWithGoogle();
    if (user) {
      router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20" />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-md shadow-2xl">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3">NUS BattlePrep</h1>
          <p className="text-zinc-400 text-lg">
            Competitive preparation for NUS computing modules.
          </p>
        </div>
        <div className="space-y-4">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-200 p-4 rounded-2xl text-xl font-semibold hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
        <div className="mt-8 border-t border-zinc-800 pt-6">
          <p className="text-zinc-500 text-sm">
            Practice. Compete. Climb the leaderboard.
          </p>
        </div>
      </div>
    </main>
  );
}