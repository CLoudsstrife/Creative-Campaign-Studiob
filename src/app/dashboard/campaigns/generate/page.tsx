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
    <main className="px-6 pb-12 lg:pr-7">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard/campaigns"
          className="inline-flex items-center gap-2 text-sm text-violet-400 transition hover:text-violet-300"
        >
          <span aria-hidden="true">←</span> Back to Campaigns
        </Link>

        <header className="mt-6 border-b border-white/[0.07] pb-8">
          <p className="text-[10px] font-semibold tracking-[.2em] text-violet-300">
            WORKSPACE / CREATIVE STUDIO
          </p>
          <h1 className="font-ui mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Build your campaign direction
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
            Start with a clear brief. Get a creative strategy and content ideas that are ready to take into production.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0b0a1c]/80 p-5 shadow-[0_20px_80px_rgba(0,0,0,.18)] sm:p-8">
          <CampaignGeneratorForm />
        </section>
      </div>
    </main>
  );
}