import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import CalendarGrid, { type CalendarItem } from "./CalendarGrid";

function currentBangkokMonth() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  return `${year}-${month}`;
}

export default async function ContentCalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const campaigns = await prisma.campaign.findMany({
    where: { userId: user.id, aiResult: { not: null } },
    select: { id: true, title: true, aiResult: true },
  });

  const items: CalendarItem[] = [];

  for (const campaign of campaigns) {
    if (!campaign.aiResult) continue;

    try {
      const result: unknown = JSON.parse(campaign.aiResult);

      if (
        typeof result !== "object" ||
        result === null ||
        !("contentIdeas" in result) ||
        !Array.isArray(result.contentIdeas)
      ) {
        continue;
      }

      for (const [index, idea] of result.contentIdeas.entries()) {
        if (
          typeof idea !== "object" ||
          idea === null ||
          !("scheduledAt" in idea) ||
          typeof idea.scheduledAt !== "string" ||
          Number.isNaN(Date.parse(idea.scheduledAt))
        ) {
          continue;
        }

        items.push({
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          ideaIndex: index,
          ideaTitle:
            "title" in idea && typeof idea.title === "string"
              ? idea.title
              : `Content idea ${index + 1}`,
          format:
            "format" in idea && typeof idea.format === "string"
              ? idea.format
              : "Konten",
          scheduledAt: idea.scheduledAt,
          workflowStatus:
            "workflowStatus" in idea && typeof idea.workflowStatus === "string"
              ? idea.workflowStatus
              : "idea",
        });
      }
    } catch {
      // Lewati hasil AI lama yang tidak berisi JSON valid.
    }
  }

  return (
    <main className="min-h-[calc(100vh-100px)] px-5 py-7 text-white sm:px-7 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-[1400px]">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg text-sm text-slate-400 transition hover:text-violet-200"
        >
          ← Kembali ke Dashboard
        </Link>

        <header className="mt-6">
          <p className="text-[10px] font-semibold tracking-[.18em] text-violet-300">
            PLAN & PUBLISH
          </p>
          <h1 className="font-ui mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Kalender Konten</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Atur tanggal publikasi dan status produksi ide kontenmu.
          </p>
        </header>

        <section className="mt-7 rounded-2xl border border-white/[0.075] bg-[#111019]/75 p-4 shadow-[0_20px_70px_-52px_rgba(0,0,0,.9)] sm:p-6">
          <CalendarGrid items={items} initialMonth={currentBangkokMonth()} />
        </section>
      </div>
    </main>
  );
}
