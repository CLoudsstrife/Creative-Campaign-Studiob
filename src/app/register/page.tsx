
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Password minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        setMessage("Pendaftaran gagal. Periksa email dan persyaratan password, lalu coba lagi.");
        return;
      }

      setMessage(
        "Pendaftaran berhasil dikirim. Silakan periksa email kamu untuk melakukan verifikasi."
      );
    } catch (error) {
      console.error("Register error:", error);

      setMessage("Terjadi kesalahan yang tidak diketahui.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden app-background px-4 py-10 text-white sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-36 -top-40 size-[520px] rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="relative grid w-full max-w-[1040px] overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#111019]/90 shadow-[0_30px_110px_rgba(0,0,0,.5)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
        <aside className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden border-r border-white/[0.07] bg-gradient-to-br from-[#20184d] via-[#151321] to-[#111019] p-10 lg:flex">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-24 size-80 rounded-full bg-fuchsia-500/15 blur-[90px]" />
          <Link href="/" className="relative z-10 flex items-center gap-3 text-sm font-semibold tracking-tight text-white"><span className="grid size-9 place-items-center rounded-xl border border-violet-200/15 bg-violet-200/[0.08] text-lg text-violet-100">✳</span> creative-flow</Link>
          <div className="relative z-10 max-w-md">
            <p className="text-[10px] font-semibold tracking-[.2em] text-violet-200/75">START WITH A GOOD BRIEF</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.04em]">Make space for ideas that move.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300/75">Build campaigns, shape platform-ready content, and keep your next steps easy to find.</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4"><p className="text-lg text-violet-200">01</p><p className="mt-2 text-xs leading-5 text-slate-300">Set the direction</p></div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.035] p-4"><p className="text-lg text-fuchsia-200">02</p><p className="mt-2 text-xs leading-5 text-slate-300">Develop the content</p></div>
            </div>
          </div>
          <p className="relative z-10 text-xs text-slate-500">CreativeFlow · Your creative work, in one place.</p>
        </aside>

        <section className="p-6 sm:p-9 lg:p-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          ← Kembali ke Home
        </Link>

        <div className="mt-8">
          <p className="text-[10px] font-semibold tracking-[.18em] text-violet-300 lg:hidden">
            CREATIVEFLOW AI
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Buat akun baru
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Mulai buat campaign kreatif dengan bantuan AI.
          </p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
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
              className="w-full rounded-lg border border-white/10 bg-[#0b0a11] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
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
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full rounded-lg border border-white/10 bg-[#0b0a11] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium"
            >
              Konfirmasi Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Masukkan ulang password"
              className="w-full rounded-lg border border-white/10 bg-[#0b0a11] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500"
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
            className="w-full rounded-lg bg-[#5232ff] px-4 py-3 font-semibold transition hover:bg-[#7258ff] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Mendaftarkan..." : "Buat Akun"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-violet-400 hover:text-violet-300"
          >
            Login
          </Link>
        </p>
        </section>
      </div>
    </main>
  );
}
