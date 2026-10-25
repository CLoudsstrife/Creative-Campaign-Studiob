
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CampaignGeneratorForm from "./CampaignGeneratorForm";

export default async function GenerateCampaignPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/campaigns"
          className="text-sm text-blue-400 transition hover:text-blue-300"
        >
          ← Kembali ke Campaign Saya
        </Link>

        <header className="mt-6">
          <p className="text-sm font-medium tracking-widest text-blue-400">
            CREATIVEFLOW AI
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            AI Campaign Generator
          </h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Masukkan brief brand kamu dan biarkan AI membantu menyusun konsep
            campaign marketing beserta ide kontennya.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <CampaignGeneratorForm />
        </section>
      </div>
    </main>
  );
}
