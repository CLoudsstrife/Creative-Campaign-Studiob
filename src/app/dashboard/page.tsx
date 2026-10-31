import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { campaignPhotos } from "@/lib/campaign-visuals";
import { SparkleLogo } from "./DashboardNavigation";

// Card labels and CTAs follow the design. Replace with a campaign category field once it exists in the database.
const cardMeta = [
  { badge: "DIRECT RESPONSE", cta: "SHOP NOW" },
  { badge: "BRAND", cta: "DISCOVER" },
  { badge: "DIRECT RESPONSE", cta: "SHOP NOW" },
  { badge: "SOCIAL PROOF", cta: "JOIN NOW" },
];

// SAMPLE: the performance numbers below are placeholders. Connect real analytics data before launch.
const sampleMetrics = [
  { views: "1.2M", likes: "32K", cart: "4.7%" },
  { views: "890K", likes: "28K", cart: "3.9%" },
  { views: "1.5M", likes: "41K", cart: "5.2%" },
  { views: "760K", likes: "22K", cart: "3.1%" },
];

const iconProps = {
  viewBox: "0 0 24 24",
  className: "size-[18px]",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch campaign stats for the signed-in user.
  const [totalCampaigns, draftCampaigns, aiCampaigns, recentCampaigns] = await Promise.all([
    prisma.campaign.count({
      where: { userId: user.id },
    }),

    prisma.campaign.count({
      where: {
        userId: user.id,
        status: "draft",
      },
    }),

    prisma.campaign.count({
      where: {
        userId: user.id,
        aiResult: { not: null },
      },
    }),

    prisma.campaign.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
      },
    }),
  ]);

  return (
    <main className="px-6 pb-10 lg:pr-7">
      <section
        aria-label="AI Campaign Pack"
        className="flex items-center justify-between gap-4 rounded-xl border border-[#5b4dff]/40 bg-gradient-to-r from-[#1a1470] via-[#3324d6] to-[#2a1c9a] px-6 py-5 shadow-[0_0_44px_rgba(70,50,255,.2)]"
      >
        <div className="flex min-w-0 items-center gap-5">
          <SparkleLogo className="size-9 shrink-0" />
          <p className="font-ui text-lg font-normal text-white sm:text-xl">
            {aiCampaigns > 0
              ? `Your AI Campaign Pack — ${aiCampaigns} ${aiCampaigns === 1 ? "ad" : "ads"} ready`
              : "Your AI Campaign Pack — generate your first ads"}
          </p>
        </div>
        <Link
          href="/dashboard/campaigns"
          className="inline-flex shrink-0 items-center gap-3 rounded-lg border border-white/15 bg-[#1b1768]/80 px-5 py-2.5 text-sm text-white transition hover:bg-[#25207f]"
        >
          View Pack
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m9 6 6 6-6 6" />
          </svg>
        </Link>
      </section>

      <section
        aria-label="Strategic Insight"
        className="mt-4 flex items-center gap-5 rounded-xl border border-white/[0.09] bg-[#0b0a1c]/80 px-6 py-5"
      >
        <span className="grid size-[72px] shrink-0 place-items-center rounded-full border-2 border-[#4a3df0]/70 bg-[#1a1560]/40 shadow-[0_0_30px_rgba(74,61,240,.25)]">
          <SparkleLogo className="size-8" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-ui text-xl font-normal text-white">Strategic Insight</h2>
          <p className="mt-1.5 text-[15px] text-slate-400">
            {totalCampaigns} campaigns · {draftCampaigns} drafts · {aiCampaigns} AI-generated
          </p>
        </div>
        <svg viewBox="0 0 200 64" className="hidden h-16 w-[200px] shrink-0 sm:block" aria-hidden="true">
          <defs>
            <linearGradient id="insight-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6c5bff" stopOpacity=".5" />
              <stop offset="1" stopColor="#6c5bff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 58 L22 56 L40 52 L58 53 L76 46 L92 48 L110 40 L126 42 L142 34 L158 36 L172 24 L186 14 L200 6 V64 H0 Z" fill="url(#insight-fill)" />
          <path d="M0 58 L22 56 L40 52 L58 53 L76 46 L92 48 L110 40 L126 42 L142 34 L158 36 L172 24 L186 14 L200 6" fill="none" stroke="#7c6bff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </section>

      {recentCampaigns.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-white/15 p-10 text-center">
          <p className="font-medium">No campaigns yet</p>
          <p className="mt-2 text-sm text-slate-400">Create your first campaign to start using creative-flow.</p>
          <Link
            href="/dashboard/campaigns/generate"
            className="mt-5 inline-flex rounded-lg bg-[#4a3df0] px-4 py-2 text-sm font-medium transition hover:bg-[#6c5bff]"
          >
            Generate campaign
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          {recentCampaigns.map((campaign, index) => {
            const meta = cardMeta[index % cardMeta.length];
            const metrics = sampleMetrics[index % sampleMetrics.length];
            const photo = campaignPhotos[index % campaignPhotos.length];

            return (
              <article key={campaign.id} className="overflow-hidden rounded-xl border border-white/[0.12] bg-[#0b0a1c] transition hover:border-[#6c5bff]/45">
                <Link
                  href={`/dashboard/campaigns/${campaign.id}`}
                  aria-label={`Open campaign ${campaign.title}`}
                  style={{
                    backgroundImage: `linear-gradient(180deg,rgba(8,7,17,.4) 0%,rgba(8,7,17,.12) 36%,rgba(8,7,17,.94) 100%),linear-gradient(140deg,rgba(76,49,255,.3),transparent 65%),url("${photo.url}")`,
                  }}
                  className="group relative block aspect-[0.52] bg-cover bg-center"
                >
                  <span className="absolute left-3.5 top-3.5 rounded-md bg-[#2b2678]/90 px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-slate-100 backdrop-blur">
                    {meta.badge}
                  </span>

                  <h3 className="font-ui absolute inset-x-5 top-[22%] line-clamp-4 text-[30px] font-bold leading-[1.04] tracking-tight text-white drop-shadow-lg">
                    {campaign.title}
                  </h3>

                  <span className="absolute bottom-6 left-5 flex items-center gap-3 text-[15px] font-semibold tracking-wide text-[#8b7bff]">
                    {meta.cta}
                    <span className="grid size-8 place-items-center rounded-full border border-[#8b7bff]/70 transition group-hover:bg-[#8b7bff]/20" aria-hidden="true">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </span>
                </Link>

                <div className="flex items-center justify-between border-t border-white/[0.09] px-5 py-3.5 text-[15px] text-slate-300">
                  <span className="flex items-center gap-2">
                    <svg {...iconProps}><path d="M7 5v14l12-7L7 5Z" /></svg>
                    {metrics.views}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg {...iconProps}><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" /></svg>
                    {metrics.likes}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg {...iconProps}><path d="M3 4.5h2.5l2 10h10l2-7.5H7" /><circle cx="9.5" cy="19" r="1.2" /><circle cx="16.5" cy="19" r="1.2" /></svg>
                    {metrics.cart}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}