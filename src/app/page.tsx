
const features = [
  {
    number: "01",
    title: "Campaign Workspace",
    description: "Organize campaign briefs, objectives, audiences, and platforms in one place.",
  },
  {
    number: "02",
    title: "AI Campaign Generator",
    description: "Turn creative briefs into campaign concepts and actionable ideas.",
  },
  {
    number: "03",
    title: "Content Studio",
    description: "Develop hooks, captions, and content ideas for your chosen platform.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#20231f]">
      <nav className="flex items-center justify-between border-b border-black/10 px-6 py-5 md:px-12">
        <a href="/" className="text-xl font-bold tracking-tight">
          creativeflow<span className="text-emerald-700">.</span>
        </a>
        <span className="text-sm text-neutral-500">
          AI-powered creative workspace
        </span>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Your creative process, reimagined
        </p>

        <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
          From campaign brief
          <br />
          to <span className="text-emerald-800">creative direction.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-600">
          A workspace to develop campaign concepts, generate content with AI,
          and keep every creative idea organized from start to finish.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <a
            href="#features"
            className="rounded-full bg-[#20231f] px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-900"
          >
            Explore workspace
          </a>
          <span className="rounded-full border border-black/15 px-6 py-3 text-sm text-neutral-600">
            Portfolio project · 2026
          </span>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 pb-24 md:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-emerald-800">THE WORKSPACE</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Everything starts with an idea.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-neutral-500">
            Three core tools for turning a brief into creative output.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm font-medium text-emerald-800">
                {feature.number}
              </p>
              <h3 className="mt-8 text-xl font-semibold">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        <footer className="mt-12 border-t border-black/10 pt-6 text-sm text-neutral-500">
          CreativeFlow AI · Built for creative teams
        </footer>
      </section>
    </main>
  );
}
