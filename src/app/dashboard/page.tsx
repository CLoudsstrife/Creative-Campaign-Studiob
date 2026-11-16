import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const stats = [
  { key: "campaigns", label: "Total campaigns" },
  { key: "drafts", label: "Drafts in progress" },
  { key: "ai", label: "AI-generated" },
] as const;

function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function CreateIcon() {
  return <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
}

function CampaignIcon({ ai }: { ai: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ai ? <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 9h8M8 12.5h5M8 16h3" /></> : <><path d="M7 4.5h10M7 19.5h10M5 7v10M19 7v10M8 12h8" /><circle cx="12" cy="12" r="2.5" /></>}
    </svg>
  );
}

function statusTone(status: string) {
  switch (status.toLowerCase()) {
    case "published": return "bg-success";
    case "scheduled": return "bg-accent";
    case "draft": return "bg-warning";
    default: return "bg-ink-subtle";
  }
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
    <main className="mx-auto w-full max-w-[1600px] space-y-7 px-5 pb-12 pt-6 sm:px-7 lg:space-y-8 lg:px-10 lg:pt-8">
      <section aria-labelledby="dashboard-heading" className="flex flex-col gap-5 border-b border-edge pb-6 sm:flex-row sm:items-end sm:justify-between sm:pb-7">
        <div className="min-w-0">
          <p className="text-sm text-ink-muted">Your campaigns, at a glance</p>
          <h1 id="dashboard-heading" className="mt-2 text-balance text-3xl font-semibold tracking-[-.035em] text-foreground sm:text-4xl">Welcome back, {firstName}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">Plan your next campaign, develop content ideas, and keep recent work moving.</p>
        </div>
        <div className="flex flex-wrap gap-2.5 sm:shrink-0">
          <Link href="/dashboard/campaigns/generate" className="dashboard-interactive group inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-background hover:bg-accent-strong active:scale-[0.98] focus-visible:outline-offset-2">
            <CreateIcon /> Open AI Studio <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/dashboard/campaigns/new" className="dashboard-interactive inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-edge bg-surface px-4 py-2.5 text-sm font-medium text-foreground hover:border-white/15 hover:bg-surface-raised active:scale-[0.98] focus-visible:outline-offset-2">
            New campaign
          </Link>
        </div>
      </section>

      <section aria-label="Campaign overview" className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.key} className="dashboard-interactive rounded-lg border border-edge bg-surface p-4 hover:border-white/15 sm:p-5">
            <p className="font-mono text-3xl font-medium tracking-tight text-foreground tabular-nums">{values[stat.key].toLocaleString("en-US")}</p>
            <p className="mt-1.5 text-sm text-ink-muted">{stat.label}</p>
          </article>
        ))}
      </section>

      <section aria-label="Campaign tools" className="grid gap-3 sm:grid-cols-2">
        <Link href="/dashboard/campaigns/generate" className="dashboard-interactive group flex min-h-24 items-center justify-between gap-4 rounded-lg border border-edge bg-surface p-4 hover:border-accent/30 hover:bg-surface-raised sm:p-5">
          <span className="flex min-w-0 items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-md border border-accent/20 bg-accent-soft text-accent"><CreateIcon /></span>
            <span className="min-w-0"><span className="block text-sm font-semibold text-foreground">Creative Studio</span><span className="mt-1 block text-xs leading-5 text-ink-muted">Generate campaign concepts and post ideas.</span></span>
          </span>
          <ArrowIcon className="size-4 shrink-0 text-ink-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
        </Link>

        <Link href="/dashboard/calendar" className="dashboard-interactive group flex min-h-24 items-center justify-between gap-4 rounded-lg border border-edge bg-surface p-4 hover:border-white/15 hover:bg-surface-raised sm:p-5">
          <span className="flex min-w-0 items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-md border border-edge bg-surface-raised text-ink-muted"><svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16M8 13h2M14 13h2M8 16h2" /></svg></span>
            <span className="min-w-0"><span className="block text-sm font-semibold text-foreground">Content calendar</span><span className="mt-1 block text-xs leading-5 text-ink-muted">Review scheduled ideas and publishing dates.</span></span>
          </span>
          <ArrowIcon className="size-4 shrink-0 text-ink-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
      </section>

      <section aria-labelledby="recent-campaigns-heading" className="overflow-hidden rounded-lg border border-edge bg-surface">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-edge px-4 py-4 sm:px-5">
          <div>
            <p className="text-xs text-ink-subtle">Workspace</p>
            <h2 id="recent-campaigns-heading" className="mt-1 text-lg font-semibold tracking-tight text-foreground">Recent campaigns</h2>
          </div>
          <Link href="/dashboard/campaigns" className="dashboard-interactive inline-flex items-center gap-2 rounded-sm text-sm font-medium text-accent hover:text-foreground focus-visible:outline-offset-2">View all <ArrowIcon /></Link>
        </div>

        {recentCampaigns.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto grid size-10 place-items-center rounded-md border border-edge bg-surface-raised text-ink-muted"><CampaignIcon ai={false} /></div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">Your first campaign starts here</h3>
            <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-ink-muted">Create a manual brief or let AI help develop content ideas around a topic.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2.5">
              <Link href="/dashboard/campaigns/generate" className="dashboard-interactive rounded-md bg-accent px-3.5 py-2 text-sm font-semibold text-background hover:bg-accent-strong active:scale-[0.98]">Open AI Studio</Link>
              <Link href="/dashboard/campaigns/new" className="dashboard-interactive rounded-md border border-edge px-3.5 py-2 text-sm font-medium text-foreground hover:bg-white/[0.04] active:scale-[0.98]">Create manually</Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-edge">
            {recentCampaigns.map((campaign) => (
              <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`} className="dashboard-interactive group flex min-w-0 flex-col gap-2.5 px-4 py-3 hover:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-md border border-edge bg-surface-raised text-ink-muted"><CampaignIcon ai={Boolean(campaign.aiResult)} /></span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground group-hover:text-white">{campaign.title}</span>
                    <span className="mt-0.5 block truncate text-xs text-ink-subtle">{campaign.platform || "No platform selected"} · {campaign.aiResult ? "AI-assisted" : "Manual brief"}</span>
                  </span>
                </span>
                <span className="flex min-w-0 items-center justify-between gap-3 pl-12 sm:shrink-0 sm:justify-end sm:pl-0">
                  <span className="inline-flex items-center gap-1.5 text-xs capitalize text-ink-muted"><span className={`size-1.5 rounded-full ${statusTone(campaign.status)}`} aria-hidden="true" />{campaign.status}</span>
                  <span className="text-xs text-ink-subtle">Updated {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(campaign.updatedAt)}</span>
                  <ArrowIcon className="size-4 text-ink-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
