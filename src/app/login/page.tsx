
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage("Email atau password salah.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setMessage(
        "Terjadi kesalahan. Periksa konfigurasi Supabase dan terminal."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center app-background px-4 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#111019] p-7 shadow-[0_24px_90px_rgba(0,0,0,.42)] sm:p-9">
        <Link
          href="/"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Kembali ke Home
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold tracking-wide text-violet-400">
            CREATIVEFLOW AI
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Selamat datang kembali
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Login untuk melanjutkan membuat campaign kreatif.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-white/10 bg-[#0b0a11] px-4 py-3 outline-none placeholder:text-slate-600 focus:border-violet-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan password"
              className="w-full rounded-lg border border-white/10 bg-[#0b0a11] px-4 py-3 outline-none placeholder:text-slate-600 focus:border-violet-500"
            />
          </div>

          {message && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-lg border border-white/10 bg-[#0b0a11] p-3 text-sm text-slate-300"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#5232ff] px-4 py-3 font-semibold transition hover:bg-[#7258ff] disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-violet-400 hover:text-violet-300"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}
