import Link from "next/link";
import { campaignPhotos } from "@/lib/campaign-visuals";

const examples = [
  { tag: "BRAND STORY · CAROUSEL", title: "Why this product exists.", detail: "A slide framework that builds the story and a reason to believe.", mark: "01" },
  { tag: "PRODUCT · REELS", title: "Show the benefit in 20 seconds.", detail: "A hook, visual flow, and CTA that turn attention into interest.", mark: "02" },
  { tag: "SOCIAL PROOF · STORY", title: "Proof people trust more.", detail: "A short format for showing customer experiences and reactions.", mark: "03" },
  { tag: "PRODUCT · DISPLAY AD", title: "One visual, one reason to click.", detail: "An ad concept focused on the main benefit and the next step.", mark: "04" },
];

const workflow = [
  { n: "01", t: "Plan", d: "Set the goals, audience, and direction of your campaign." },
  { n: "02", t: "Develop", d: "Build the big idea and the brief for each piece of content." },
  { n: "03", t: "Manage", d: "Organize status, schedule, and campaign assets." },
];

export default function Home() {
  return (
    <main className="app-background min-h-screen overflow-hidden text-white">
      <nav className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3 text-[15px] font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-lg text-violet-200">✳</span>
          creative-flow
        </Link>
        <div className="flex items-center gap-2 sm:gap-5">
          <span className="hidden text-xs text-slate-500 md:block">AI-powered campaign workspace</span>
          <Link href="/login" className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:text-white">Sign in</Link>
          <Link href="/register" className="rounded-lg border border-violet-200/25 bg-gradient-to-r from-[#4324ed] via-[#6d35ff] to-[#5130ee] px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_32px_rgba(91,45,255,.4)] transition hover:brightness-125">Get started free <span aria-hidden="true">↗</span></Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-5 pb-20 pt-12 sm:px-8 md:pt-20 lg:grid-cols-[.93fr_1.07fr] lg:px-12 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute -left-40 top-12 size-[500px] rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="relative z-[1]">
          <p className="inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-300/[0.06] px-3 py-1.5 text-[11px] font-medium tracking-wide text-violet-200"><span className="size-1.5 rounded-full bg-violet-300" /> A CREATIVE WORKSPACE FOR CAMPAIGN TEAMS</p>
          <h1 className="mt-7 max-w-3xl text-[clamp(3rem,6.7vw,6.4rem)] font-semibold leading-[.98] tracking-[-.065em]">From brief,<br />to a <span className="bg-gradient-to-r from-violet-200 via-fuchsia-200 to-violet-400 bg-clip-text text-transparent">campaign</span><br />that moves.</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">Plan a campaign, generate thoughtful content ideas, and keep every next step organized in one creative workspace.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register" className="rounded-xl border border-violet-200/20 bg-gradient-to-r from-[#4324ed] via-[#6d35ff] to-[#5130ee] px-5 py-3 text-sm font-semibold shadow-[0_10px_35px_rgba(91,45,255,.4)] transition hover:-translate-y-0.5 hover:brightness-125">Create your first campaign <span className="ml-2">→</span></Link>
            <Link href="/login" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:bg-white/[0.04]">I already have an account</Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-slate-500"><span><b className="mr-2 text-violet-300">✳</b>Ideas you can act on</span><span><b className="mr-2 text-violet-300">✳</b>Brand context that stays put</span><span><b className="mr-2 text-violet-300">✳</b>A clearer path to publishing</span></div>
        </div>

        <div className="relative mx-auto w-full max-w-[680px] lg:ml-auto">
          <div className="absolute -inset-8 rounded-[40px] bg-[radial-gradient(ellipse,#6537ff55,transparent_67%)] blur-3xl" />
          <div className="relative overflow-hidden rounded-[26px] border border-violet-300/20 bg-[#111019] shadow-[0_30px_100px_rgba(0,0,0,.55),0_0_55px_rgba(91,45,255,.12)]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-lg bg-violet-400/15 text-sm text-violet-200">✳</span><span className="text-xs font-medium text-slate-200">Campaign workspace</span></div>
              <span className="rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-2.5 py-1 text-[10px] text-emerald-200">● Active draft</span>
            </div>
            <div className="p-5 sm:p-7">
              <p className="text-[10px] font-semibold tracking-[.18em] text-violet-300">BRAND CAMPAIGN · INSTAGRAM</p>
              <h2 className="mt-3 max-w-md text-2xl font-semibold leading-tight tracking-tight sm:text-[32px]">Stories that make a brand memorable.</h2>
              <div className="mt-5 grid grid-cols-3 gap-2 border-y border-white/[0.07] py-4 sm:gap-4">
                {["01 · Awareness", "02 · Consideration", "03 · Action"].map((step) => <div key={step} className="text-[10px] text-slate-500 sm:text-xs">{step}</div>)}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
                {examples.map((item, index) => <article key={item.mark} style={{ backgroundImage: `linear-gradient(180deg,rgba(8,7,14,.04) 0%,rgba(8,7,14,.28) 30%,rgba(8,7,14,.96) 100%),linear-gradient(135deg,rgba(124,58,237,.25),transparent 65%),url("${campaignPhotos[index].url}")` }} className="min-h-[190px] rounded-2xl border border-violet-200/15 bg-cover bg-center p-3.5 shadow-[inset_0_0_45px_rgba(124,58,237,.12)] transition duration-300 hover:-translate-y-1 hover:border-violet-200/30 sm:min-h-[230px] sm:p-3">
                  <span className="text-[9px] font-semibold tracking-wide text-violet-200/75">{item.tag}</span>
                  <span className="mt-6 block text-2xl font-light text-white/25 sm:mt-10 sm:text-3xl">{item.mark}</span>
                  <h3 className="mt-2 text-xs font-semibold leading-4 sm:text-sm sm:leading-5">{item.title}</h3>
                  <p className="mt-2 hidden text-[10px] leading-4 text-slate-400 sm:block">{item.detail}</p>
                </article>)}
              </div>
              <p className="mt-3 flex flex-wrap justify-end gap-x-2 text-[9px] text-slate-600">Photos: {campaignPhotos.map((photo) => <a key={photo.credit} href={photo.source} target="_blank" rel="noreferrer" className="transition hover:text-violet-300">{photo.credit} · Unsplash</a>)}</p>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-violet-300/10 bg-violet-300/[0.045] px-4 py-3">
                <div><p className="text-[10px] text-slate-500">CREATIVE DIRECTION</p><p className="mt-1 text-xs text-slate-200">Turn brand benefits into a story that&apos;s easy to remember.</p></div>
                <span className="text-lg text-violet-300">↗</span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-white/10 bg-[#191722] px-4 py-3 shadow-xl sm:block"><p className="text-[10px] text-slate-500">CONTENT IDEAS</p><p className="mt-1 text-sm font-semibold">Brief ready to develop <span className="text-violet-300">✦</span></p></div>
        </div>
      </section>

      <section aria-labelledby="workspace-features" className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-24">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[.2em] text-violet-300">A WORKSPACE THAT CONNECTS THE DOTS</p>
            <h2 id="workspace-features" className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">From the first idea to the next action.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400">Keep the brief, creative direction, content ideas, and schedule close together as your campaign takes shape.</p>
        </div>

        {/* Rendyn's Bento Grid pattern, adapted to the project's existing Tailwind styles. */}
        <div className="grid auto-rows-[minmax(180px,auto)] gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <article className="group relative isolate overflow-hidden rounded-2xl border border-violet-300/15 bg-gradient-to-br from-[#221b4c] via-[#151321] to-[#111019] p-6 transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/30 sm:row-span-2 sm:p-7">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 -z-10 size-64 rounded-full bg-violet-500/20 blur-[80px] transition group-hover:bg-violet-500/30" />
            <span className="grid size-10 place-items-center rounded-xl border border-violet-200/10 bg-violet-200/[0.08] text-lg text-violet-100" aria-hidden="true">✳</span>
            <p className="mt-6 text-[10px] font-semibold tracking-[.18em] text-violet-200/75">CAMPAIGN STUDIO</p>
            <h3 className="mt-2 max-w-xs text-xl font-semibold leading-tight sm:text-2xl">Turn a short brief into a creative direction.</h3>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">Give your campaign a goal and audience, then develop a big idea and formats you can take into production.</p>
            <div className="mt-7 rounded-xl border border-white/[0.08] bg-[#0a0913]/70 p-4">
              <p className="text-[10px] font-semibold tracking-[.14em] text-slate-500">YOUR WORKFLOW</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">Brief</span>
                <span className="self-center text-violet-300" aria-hidden="true">→</span>
                <span className="rounded-full border border-violet-300/15 bg-violet-300/[0.08] px-3 py-1.5 text-violet-100">Big idea</span>
                <span className="self-center text-violet-300" aria-hidden="true">→</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">Content</span>
              </div>
            </div>
          </article>

          <article className="relative isolate overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111019]/90 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/20">
            <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 -z-10 size-40 rounded-full bg-cyan-400/10 blur-3xl" />
            <p className="text-[10px] font-semibold tracking-[.18em] text-cyan-200/75">BISIK PRESET</p>
            <h3 className="mt-3 text-lg font-semibold">Start with the topic.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">BISIK&apos;s discussion context and editorial direction are already saved, so you can focus on the issue or occasion.</p>
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-xs text-slate-300"><span className="size-1.5 rounded-full bg-cyan-200" /> Topic in, post ideas out</div>
          </article>

          <article className="relative isolate overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111019]/90 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-fuchsia-200/20">
            <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 -z-10 size-40 rounded-full bg-fuchsia-400/10 blur-3xl" />
            <p className="text-[10px] font-semibold tracking-[.18em] text-fuchsia-200/75">CONTENT CALENDAR</p>
            <h3 className="mt-3 text-lg font-semibold">Keep the next step visible.</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Schedule content ideas and track whether they are still ideas, in draft, ready for review, or published.</p>
            <div className="mt-5 flex flex-wrap gap-1.5 text-[10px] text-slate-300"><span className="rounded-md bg-white/[0.05] px-2 py-1">IDEA</span><span className="rounded-md bg-violet-300/10 px-2 py-1 text-violet-200">DRAFT</span><span className="rounded-md bg-emerald-300/10 px-2 py-1 text-emerald-200">READY</span></div>
          </article>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-white/[0.018]">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:items-center lg:px-12 lg:py-16">
          <div><p className="text-[10px] font-semibold tracking-[.2em] text-violet-300">ONE WORKFLOW</p><h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">From idea to production-ready.</h2></div>
          <div className="grid gap-3 sm:grid-cols-3">{workflow.map((item) => <div key={item.n} className="rounded-xl border border-white/[0.07] bg-[#100f16] p-4"><p className="text-[10px] text-violet-300">{item.n}</p><h3 className="mt-3 text-sm font-semibold">{item.t}</h3><p className="mt-1.5 text-xs leading-5 text-slate-500">{item.d}</p></div>)}</div>
        </div>
      </section>
      <footer className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-slate-600 sm:px-8 lg:px-12"><span>creative-flow · a creative campaign workspace</span><span>Designed for ideas in motion.</span></footer>
    </main>
  );
}
