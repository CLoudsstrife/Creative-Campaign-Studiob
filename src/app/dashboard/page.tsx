import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const stats = [
  { key: "campaigns", label: "Total campaigns", icon: "grid" },
  { key: "drafts", label: "Drafts in progress", icon: "draft" },
  { key: "ai", label: "AI-generated", icon: "spark" },
] as const;

function StatIcon({ name }: { name: (typeof stats)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "draft") {
    return <svg {...common}><path d="M5 4.5h14v15H5z" /><path d="M8 9h8M8 12.5h8M8 16h5" /></svg>;
  }
  if (name === "spark") {
    return <svg {...common}><path d="M12 3 14 9.5 20.5 12 14 14.5 12 21l-2-6.5L3.5 12 10 9.5 12 3Z" /></svg>;
  }
  return <svg {...common}><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const [totalCampaigns, draftCampaigns, aiCampaigns, recentCampaigns] = await Promise.all([
    prisma.campaign.count({ where: { userId: user.id } }),
    prisma.campaign.count({ where: { userId: user.id, status: "draft" } }),
    prisma.campaign.count({ where: { userId: user.id, aiResult: { not: null } } }),
    prisma.campaign.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: { id: true, title: true, status: true, platform: true, updatedAt: true, aiResult: true },
    }),
  ]);

  const values = { campaigns: totalCampaigns, drafts: draftCampaigns, ai: aiCampaigns };
  const firstName = user.email?.split("@")[0] || "there";

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-8 px-5 pb-12 pt-6 sm:px-7 lg:px-10 lg:pt-8">
      <section className="relative isolate overflow-hidden rounded-[28px] border border-violet-300/15 bg-[#11101d]/80 p-6 shadow-[0_24px_80px_-50px_rgba(109,72,255,.55)] sm:p-9 lg:p-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-40 -z-10 size-[420px] rounded-full bg-violet-600/20 blur-[110px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 left-1/3 -z-10 size-[360px] rounded-full bg-indigo-600/10 blur-[100px]" />
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.15em] text-violet-200">
              <span className="size-1.5 rounded-full bg-emerald-300" /> Your creative workspace
            </p>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl lg:text-5xl">
              Welcome back, <span className="bg-gradient-to-r from-violet-200 to-fuchsia-200 bg-clip-text text-transparent">{firstName}</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
              Turn your next brief into strong content ideas, then keep the work organized from draft to publishing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/campaigns/generate" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_32px_-14px_rgba(124,58,237,.8)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-offset-4">
              <span aria-hidden="true">✳</span> Open AI Studio <ArrowIcon />
            </Link>
            <Link href="/dashboard/campaigns/new" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.07]">
              New campaign
            </Link>
          </div>
        </div>
      </section>

      <section aria-label="Campaign overview" className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <article key={stat.key} className="group rounded-2xl border border-white/[0.075] bg-[#111019]/75 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/20 hover:bg-[#151321] sm:p-6">
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-xl border border-violet-300/10 bg-violet-300/[0.07] text-violet-200"><StatIcon name={stat.icon} /></span>
              <span className="text-xs text-slate-600">0{index + 1}</span>
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight text-white tabular-nums">{values[stat.key].toLocaleString("en-US")}</p>
            <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
          </article>
        ))}
      </section>

      <section aria-label="Quick start" className="grid gap-3 lg:grid-cols-3">
        <Link href="/dashboard/campaigns/generate" className="group relative isolate flex min-h-48 flex-col justify-between overflow-hidden rounded-2xl border border-violet-300/20 bg-gradient-to-br from-[#30216f] via-[#17142c] to-[#111019] p-6 transition duration-200 hover:-translate-y-0.5 hover:border-violet-200/35 lg:col-span-2 lg:min-h-56 lg:p-7">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 -z-10 size-64 rounded-full bg-violet-400/20 blur-3xl transition group-hover:bg-violet-400/30" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-violet-200/80">Creative Studio</p>
              <h2 className="mt-3 max-w-lg text-2xl font-semibold tracking-tight text-white sm:text-3xl">Start with a brief. Leave with a plan.</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300/75">Generate campaign concepts or turn a topic into a set of post ideas.</p>
            </div>
            <span className="hidden size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl text-violet-100 sm:grid" aria-hidden="true">✳</span>
          </div>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-violet-200">Create with AI <span className="transition-transform group-hover:translate-x-1"><ArrowIcon /></span></span>
        </Link>

        <Link href="/dashboard/calendar" className="group flex min-h-48 flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111019]/75 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200/20 hover:bg-[#151321] lg:min-h-56 lg:p-7">
          <div>
            <span className="grid size-10 place-items-center rounded-xl border border-cyan-200/10 bg-cyan-200/[0.06] text-cyan-100" aria-hidden="true">▦</span>
            <h2 className="mt-4 text-lg font-semibold text-white">Content calendar</h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-400">Review scheduled ideas and move your content toward publishing.</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-300 group-hover:text-white">Open calendar <span className="transition-transform group-hover:translate-x-1"><ArrowIcon /></span></span>
        </Link>
      </section>

      <section aria-labelledby="recent-campaigns-heading" className="overflow-hidden rounded-2xl border border-white/[0.075] bg-[#111019]/70">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.15em] text-violet-300/80">Workspace</p>
            <h2 id="recent-campaigns-heading" className="mt-1.5 text-xl font-semibold tracking-tight text-white">Recent campaigns</h2>
          </div>
          <Link href="/dashboard/campaigns" className="inline-flex items-center gap-2 text-sm font-medium text-violet-200 transition hover:text-white">View all <ArrowIcon /></Link>
        </div>

        {recentCampaigns.length === 0 ? (
          <div className="px-6 py-12 text-center sm:py-16">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-violet-300/10 bg-violet-300/[0.06] text-xl text-violet-200" aria-hidden="true">✳</span>
            <h3 className="mt-4 text-base font-semibold text-white">Your first campaign starts here</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Create a manual brief or let AI help you develop content ideas around a topic.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/dashboard/campaigns/generate" className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500">Open AI Studio</Link>
              <Link href="/dashboard/campaigns/new" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.05]">Create manually</Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {recentCampaigns.map((campaign) => (
              <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`} className="group flex flex-col gap-3 px-5 py-4 transition hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-violet-200" aria-hidden="true">{campaign.aiResult ? "✳" : "↗"}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-100 group-hover:text-white">{campaign.title}</span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{campaign.platform || "No platform selected"} · {campaign.aiResult ? "AI-assisted" : "Manual brief"}</span>
                  </span>
                </div>
                <span className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1 text-[11px] capitalize text-slate-300">{campaign.status}</span>
                  <span className="text-xs text-slate-500">Updated {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(campaign.updatedAt)}</span>
                  <span className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-violet-200"><ArrowIcon /></span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
