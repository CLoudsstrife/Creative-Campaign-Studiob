
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import NewCampaignForm from "./NewCampaignForm";

export default async function NewCampaignPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="min-h-[calc(100vh-100px)] px-5 py-7 text-white sm:px-7 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-2 rounded-lg text-sm text-slate-400 transition hover:text-violet-200"
        >
          ← Kembali ke Campaign Saya
        </Link>

        <div className="mt-6">
          <p className="text-[10px] font-semibold tracking-[.18em] text-violet-300">
            CAMPAIGN WORKSPACE
          </p>
          <h1 className="font-ui mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Buat Campaign</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Masukkan informasi dasar campaign pemasaranmu.
          </p>
        </div>

        <div className="mt-7 rounded-2xl border border-white/[0.075] bg-[#111019]/75 p-5 shadow-[0_20px_70px_-52px_rgba(0,0,0,.9)] sm:p-8">
          <NewCampaignForm />
        </div>
      </div>
    </main>
  );
}
