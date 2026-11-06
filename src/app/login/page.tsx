
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden app-background px-4 py-10 text-white sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-36 -top-40 size-[520px] rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="relative grid w-full max-w-[1040px] overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#111019]/90 shadow-[0_30px_110px_rgba(0,0,0,.5)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
        <aside className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden border-r border-white/[0.07] bg-gradient-to-br from-[#20184d] via-[#151321] to-[#111019] p-10 lg:flex">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -right-24 size-80 rounded-full bg-violet-500/20 blur-[90px]" />
          <Link href="/" className="relative z-10 flex items-center gap-3 text-sm font-semibold tracking-tight text-white"><span className="grid size-9 place-items-center rounded-xl border border-violet-200/15 bg-violet-200/[0.08] text-lg text-violet-100">✳</span> creative-flow</Link>
          <div className="relative z-10 max-w-md">
            <p className="text-[10px] font-semibold tracking-[.2em] text-violet-200/75">YOUR CREATIVE WORKSPACE</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-.04em]">Good ideas deserve a clear next step.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300/75">Bring your campaign brief, content ideas, and publishing plan together in one place.</p>
            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <p className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-violet-300/10 text-violet-200">✓</span>Develop stronger campaign directions</p>
              <p className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-violet-300/10 text-violet-200">✓</span>Keep content work organized</p>
            </div>
          </div>
          <p className="relative z-10 text-xs text-slate-500">CreativeFlow · Plan with intention.</p>
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
        </section>
      </div>
    </main>
  );
}
