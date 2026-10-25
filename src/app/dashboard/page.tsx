
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-400">
              CREATIVEFLOW AI
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Selamat datang kembali di CreativeFlow AI.
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Akun kamu
          </h2>

          <p className="mt-3 text-sm text-slate-400">
            Email yang sedang login
          </p>

          <p className="mt-1 break-all font-medium">
            {user.email}
          </p>

          <div className="mt-5 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
            Authentication aktif
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">
              Campaign Saya
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Campaign yang kamu buat nantinya akan muncul di sini.
            </p>

            <p className="mt-5 text-sm text-blue-400">
              Segera hadir
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">
              AI Campaign Generator
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Buat ide campaign dan konten pemasaran menggunakan AI.
            </p>

            <p className="mt-5 text-sm text-blue-400">
              Segera hadir
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
