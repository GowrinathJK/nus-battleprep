"use client";

import Navbar from "../../Components/Navbar";

export default function LoginPage() {

  function handleLogin() {

    alert("Firebase Google Authentication will be connected here later.");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white">

      <Navbar />

      <section className="flex min-h-[85vh] items-center justify-center px-6">

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-10 text-center backdrop-blur-md">

          {/* Title */}
          <h1 className="mb-4 text-5xl font-extrabold">
            NUS BattlePrep
          </h1>

          <p className="mb-10 text-lg text-gray-300">
            Continue with your NUS account to start battling.
          </p>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full rounded-2xl bg-purple-600 p-5 text-lg font-bold transition hover:bg-purple-500"
          >
            Continue with NUS Account
          </button>

          {/* Footer */}
          <p className="mt-8 text-sm text-gray-400">
            Only NUS email accounts will be allowed access.
          </p>

        </div>

      </section>

    </main>
  );
}