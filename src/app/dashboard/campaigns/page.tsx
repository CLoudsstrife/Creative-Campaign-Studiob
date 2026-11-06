import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import CampaignFilters from "./CampaignFilters";

export default async function CampaignsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const campaigns = await prisma.campaign.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <main className="mx-auto w-full max-w-[1600px] px-5 pb-14 pt-6 sm:px-7 lg:px-10 lg:pt-8">
      <div className="mx-auto max-w-[1400px]">
        <header className="flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[.2em] text-violet-300">
              WORKSPACE / LIBRARY
            </p>

            <h1 className="font-ui mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Campaigns
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              All your briefs, ideas, and campaign work in one place.
            </p>
          </div>

          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4a3df0] px-5 py-3 text-sm font-semibold shadow-[0_8px_28px_rgba(74,61,240,.3)] transition hover:bg-[#6c5bff]"
          >
            + New Campaign
          </Link>
        </header>

        <section className="mt-8">
          {campaigns.length === 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">All Campaigns</h2>

                <span className="text-sm text-slate-400">0 campaigns</span>
              </div>

              <div className="rounded-2xl border border-dashed border-white/10 bg-[#0b0a1c]/60 px-6 py-16 text-center">
                <h3 className="text-xl font-semibold">No campaigns yet</h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  Create your first campaign to start organizing your ideas,
                  target audience, platform, and marketing strategy.
                </p>

                <Link
                  href="/dashboard/campaigns/new"
                  className="mt-6 inline-flex rounded-lg bg-[#4a3df0] px-5 py-3 font-medium transition hover:bg-[#6c5bff]"
                >
                  Create First Campaign
                </Link>
              </div>
            </>
          ) : (
            <CampaignFilters campaigns={campaigns} />
          )}
        </section>
      </div>
    </main>
  );
}
