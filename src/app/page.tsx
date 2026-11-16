import Link from "next/link";
import { campaignPhotos } from "@/lib/campaign-visuals";

const examples = [
  { tag: "Brand story carousel", title: "Why this product exists.", detail: "The story behind the product." },
  { tag: "Product reels", title: "Show the benefit in 20 seconds.", detail: "A hook, visual, and CTA." },
  { tag: "Social proof story", title: "Proof people trust more.", detail: "Customer stories and reactions." },
  { tag: "Product display ad", title: "One visual, one reason to click.", detail: "Lead with the main benefit." },
];

const workflow = [
  { title: "Plan", detail: "Set campaign goals, audience, and direction." },
  { title: "Develop", detail: "Shape the big idea and brief for each piece." },
  { title: "Manage", detail: "Track status, schedule, and campaign assets." },
];

function BrandMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5.75" y="5.75" width="28.5" height="28.5" rx="8" />
      <path d="M14 14h12v12H14zM20 14v12M14 20h12" />
    </svg>
  );
}

function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function BriefIcon() {
  return <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M9 5V3.5h6V5M8 10h8M8 14h5" /></svg>;
}

function ContextIcon() {
  return <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5.5h16v11H9l-5 3v-14Z" /><path d="M8 9h8M8 13h5" /></svg>;
}

function CalendarIcon() {
  return <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16M8 13h2M14 13h2M8 16h2" /></svg>;
}

export default function Home() {
  return (
    <main className="app-background min-h-screen overflow-x-clip text-foreground">
      <nav aria-label="Main navigation" className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-2 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 rounded-sm text-foreground focus-visible:outline-offset-4">
          <BrandMark className="size-10 shrink-0 text-accent" />
          <span className="truncate text-sm font-semibold tracking-tight sm:text-[15px]">creative-flow</span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <span className="mr-2 hidden text-sm text-ink-subtle xl:block">Campaign planning workspace</span>
          <Link href="/login" className="dashboard-interactive inline-flex min-h-10 items-center justify-center rounded-md px-3 text-sm text-ink-muted hover:bg-white/[0.04] hover:text-foreground active:scale-[0.98] focus-visible:outline-offset-2">Sign in</Link>
          <Link href="/register" className="dashboard-interactive inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-accent px-3.5 text-sm font-semibold text-background hover:bg-accent-strong active:scale-[0.98] focus-visible:outline-offset-2 sm:px-4">Get started <ArrowIcon className="size-3.5" /></Link>
        </div>
      </nav>

      <section aria-labelledby="landing-heading" className="mx-auto grid w-full max-w-[1440px] min-w-0 items-center gap-9 px-5 pb-16 pt-7 sm:px-8 sm:pt-10 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-10 lg:px-12 lg:pb-20 lg:pt-8">
        <div className="min-w-0">
          <h1 id="landing-heading" className="min-w-0 max-w-[18ch] break-words text-[clamp(2.5rem,4.6vw,4.35rem)] font-semibold leading-[1.02] tracking-[-.04em] text-foreground">
            From brief to a campaign that moves.
          </h1>
          <p className="mt-5 max-w-[46ch] text-base leading-7 text-ink-muted sm:mt-6">
            Plan briefs, develop ideas with BISIK, and schedule content on the calendar.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:mt-7">
            <Link href="/register" className="dashboard-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-background hover:bg-accent-strong active:scale-[0.98] focus-visible:outline-offset-2 sm:px-5">
              Start creating <ArrowIcon />
            </Link>
            <Link href="/login" className="dashboard-interactive inline-flex min-h-11 items-center justify-center rounded-md border border-edge px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-raised active:scale-[0.98] focus-visible:outline-offset-2 sm:px-5">
              I already have an account
            </Link>
          </div>
          <ul className="mt-6 grid gap-2.5 text-sm text-ink-muted sm:mt-7 sm:grid-cols-3 sm:gap-3" aria-label="Workspace benefits">
            <li className="flex items-center gap-2"><BriefIcon /> Clear briefs</li>
            <li className="flex items-center gap-2"><ContextIcon /> BISIK context</li>
            <li className="flex items-center gap-2"><CalendarIcon /> Calendar planning</li>
          </ul>
        </div>

        <div className="min-w-0 lg:ml-auto lg:w-full lg:max-w-[680px]">
          <div className="overflow-hidden rounded-lg border border-edge bg-surface shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-edge px-4 py-3.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <BrandMark className="size-8 shrink-0 text-accent" />
                <span className="truncate text-sm font-medium text-foreground">Campaign workspace</span>
              </div>
              <span className="shrink-0 rounded-md border border-edge bg-surface-raised px-2.5 py-1 text-xs text-ink-muted">Active draft</span>
            </div>

            <div className="p-4 sm:p-5">
              <p className="mb-1 text-xs text-ink-muted">Brand campaign for Instagram</p>
              <h2 className="max-w-xl text-xl font-semibold leading-tight tracking-[-.025em] text-foreground sm:text-2xl">Stories that make a brand memorable.</h2>
              <ol aria-label="Campaign stages" className="mt-4 grid grid-cols-3 gap-2 border-y border-edge py-3 text-xs text-ink-muted sm:mt-5 sm:py-3.5 sm:text-sm">
                <li>Awareness</li>
                <li className="border-l border-edge pl-3">Consideration</li>
                <li className="border-l border-edge pl-3">Action</li>
              </ol>

              <div className="mt-4 grid min-w-0 grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                {examples.map((item, index) => (
                  <article
                    key={item.tag}
                    style={{ backgroundImage: `linear-gradient(180deg, color-mix(in srgb, var(--background) 22%, transparent) 0%, color-mix(in srgb, var(--background) 48%, transparent) 42%, var(--background) 100%), url("${campaignPhotos[index].url}")` }}
                    className="dashboard-interactive relative flex min-h-[174px] min-w-0 flex-col items-start justify-between overflow-hidden rounded-md border border-edge bg-cover bg-center p-3.5 hover:border-accent/40 active:scale-[0.99] sm:min-h-[184px] sm:p-4"
                  >
                    <span className="relative rounded-sm border border-edge bg-background px-2 py-1 text-xs font-medium text-foreground">{item.tag}</span>
                    <div className="relative max-w-[28ch]">
                      <h3 className="text-base font-semibold leading-5 text-foreground sm:text-lg sm:leading-6">{item.title}</h3>
                      <p className="mt-1.5 text-xs leading-5 text-foreground/80">{item.detail}</p>
                    </div>
                  </article>
                ))}
              </div>

              <p className="mt-3 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs text-ink-subtle">
                <span>Photos:</span>
                {campaignPhotos.map((photo) => <a key={photo.credit} href={photo.source} target="_blank" rel="noreferrer" className="dashboard-interactive rounded-sm underline decoration-white/20 underline-offset-2 hover:text-foreground hover:decoration-current focus-visible:outline-offset-2">{photo.credit}, Unsplash</a>)}
              </p>

              <div className="mt-4 flex items-start gap-3 border-t border-edge pt-4">
                <span className="mt-0.5 text-accent"><ContextIcon /></span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink-muted">Creative direction</p>
                  <p className="mt-1 text-sm leading-5 text-foreground">Turn brand benefits into a story that&apos;s easy to remember.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="workspace-features" className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-4 sm:px-8 lg:px-12 lg:pb-20 lg:pt-8">
        <div className="mb-6 flex flex-col justify-between gap-3 border-b border-edge pb-5 sm:flex-row sm:items-end sm:gap-8">
          <h2 id="workspace-features" className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Keep every part of the campaign in reach.</h2>
          <p className="max-w-md text-sm leading-6 text-ink-muted">Keep the brief, creative direction, content ideas, and schedule close together.</p>
        </div>

        <div className="grid min-w-0 gap-3 md:grid-cols-3">
          {[
            { title: "Campaign Studio", icon: BriefIcon, detail: "Set a goal and audience, then shape a big idea and the formats for production." },
            { title: "BISIK preset", icon: ContextIcon, detail: "BISIK’s discussion context and editorial direction are saved. Focus on the issue or occasion." },
            { title: "Content calendar", icon: CalendarIcon, detail: "Schedule ideas and follow them from draft to review to published." },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="dashboard-interactive min-w-0 rounded-lg border border-edge bg-surface p-4 hover:border-white/15 hover:bg-surface-raised sm:p-5">
                <div className="flex items-center gap-2.5 text-accent"><Icon /><h3 className="text-base font-semibold text-foreground">{feature.title}</h3></div>
                <p className="mt-3 text-sm leading-6 text-ink-muted">{feature.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-label="Campaign workflow" className="border-y border-edge bg-surface">
        <div className="mx-auto grid w-full max-w-[1440px] gap-5 px-5 py-8 sm:px-8 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] md:items-center lg:px-12 lg:py-10">
          <h2 className="max-w-sm text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">From idea to production-ready.</h2>
          <ol className="grid min-w-0 divide-y divide-edge sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {workflow.map((item) => (
              <li key={item.title} className="py-3 sm:px-4 sm:py-1 first:sm:pl-0 last:sm:pr-0">
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-5 text-ink-muted">{item.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-ink-subtle sm:px-8 lg:px-12">
        <span>creative-flow, a creative campaign workspace</span>
        <span>Designed for ideas in motion.</span>
      </footer>
    </main>
  );
}
