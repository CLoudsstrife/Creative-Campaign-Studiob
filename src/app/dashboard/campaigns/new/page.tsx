
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
    <main className="app-background min-h-full px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/campaigns"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← Kembali ke Campaign Saya
        </Link>

        <div className="mt-6">
          <p className="text-sm font-medium tracking-widest text-violet-400">
            CREATIVEFLOW AI
          </p>
          <h1 className="mt-2 text-3xl font-bold">Buat Campaign</h1>
          <p className="mt-2 text-slate-400">
            Masukkan informasi dasar campaign pemasaranmu.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-[#111019] p-6 sm:p-8">
          <NewCampaignForm />
        </div>
      </div>
    </main>
  );
}
