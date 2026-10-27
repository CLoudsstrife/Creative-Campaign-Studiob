
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import DownloadCampaignPDF from "./DownloadCampaignPDF";

type Props = {
  params: Promise<{ id: string }>;
};

type ContentIdea = {
  title: string;
  format: string;
  description: string;
};

type CampaignAIResult = {
  campaignTitle: string;
  bigIdea: string;
  objective: string;
  keyMessage: string;
  contentIdeas: ContentIdea[];
  callToAction: string;
  input?: {
    brandName?: string;
    product?: string;
    targetAudience?: string;
    platform?: string;
    tone?: string;
  };
};

function parseAIResult(value: string | null): CampaignAIResult | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("campaignTitle" in parsed) ||
      !("bigIdea" in parsed) ||
      !("objective" in parsed) ||
      !("keyMessage" in parsed) ||
      !("contentIdeas" in parsed) ||
      !("callToAction" in parsed)
    ) {
      return null;
    }

    const result = parsed as CampaignAIResult;

    if (
      typeof result.campaignTitle !== "string" ||
      typeof result.bigIdea !== "string" ||
      typeof result.objective !== "string" ||
      typeof result.keyMessage !== "string" ||
      typeof result.callToAction !== "string" ||
      !Array.isArray(result.contentIdeas) ||
      !result.contentIdeas.every(
        (idea) =>
          idea &&
          typeof idea.title === "string" &&
          typeof idea.format === "string" &&
          typeof idea.description === "string"
      )
    ) {
      return null;
    }

    return result;
  } catch {
    return null;
  }
}

export default async function CampaignDetailPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const campaign = await prisma.campaign.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!campaign) {
    notFound();
  }

  const aiResult = parseAIResult(campaign.aiResult);

  const updatedAtFormatted = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(campaign.updatedAt);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/campaigns"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Kembali ke Campaign Saya
        </Link>

        <header className="mt-6">
          <p className="text-sm font-medium tracking-widest text-blue-400">
            CREATIVEFLOW AI
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="break-words text-3xl font-bold">
              {campaign.title}
            </h1>

            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
              {campaign.status}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-400">
            Terakhir diperbarui {updatedAtFormatted}
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">
              Informasi Campaign
            </h2>

            <div className="flex flex-wrap gap-3">
              <DownloadCampaignPDF
                campaign={{
                  title: campaign.title,
                  description: campaign.description,
                  brandName: campaign.brandName,
                  targetAudience: campaign.targetAudience,
                  platform: campaign.platform,
                  tone: campaign.tone,
                  status: campaign.status,
                  updatedAt: updatedAtFormatted,
                  aiResult,
                }}
              />

              {campaign.aiResult && (
                <Link
                  href={`/dashboard/campaigns/${campaign.id}/edit-ai`}
                  className="rounded-lg border border-blue-500/50 px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/10"
                >
                  Edit AI Results
                </Link>
              )}

              <Link
                href={`/dashboard/campaigns/${campaign.id}/edit`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
              >
                Edit Campaign
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Nama Brand</p>
              <p className="mt-1 font-medium">
                {campaign.brandName || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Platform</p>
              <p className="mt-1 font-medium">
                {campaign.platform || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Target Audiens</p>
              <p className="mt-1 whitespace-pre-wrap font-medium">
                {campaign.targetAudience || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Tone of Voice</p>
              <p className="mt-1 font-medium">
                {campaign.tone || "-"}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-800 pt-5">
            <p className="text-sm text-slate-500">Deskripsi</p>
            <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
              {campaign.description || "Belum ada deskripsi."}
            </p>
          </div>
        </section>

        {aiResult ? (
          <section className="mt-8 space-y-6">
            <div>
              <p className="text-sm font-medium tracking-widest text-blue-400">
                AI GENERATED CAMPAIGN
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {aiResult.campaignTitle}
              </h2>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
              <div>
                <h3 className="font-semibold text-blue-300">
                  Big Idea
                </h3>
                <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                  {aiResult.bigIdea}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-blue-300">
                  Campaign Objective
                </h3>
                <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                  {aiResult.objective}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-blue-300">
                  Key Message
                </h3>
                <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                  {aiResult.keyMessage}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold">Content Ideas</h3>

              <div className="mt-4 grid gap-4">
                {aiResult.contentIdeas.map((idea, index) => (
                  <article
                    key={`${idea.title}-${index}`}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <p className="text-sm text-blue-400">
                      CONTENT IDEA {index + 1} · {idea.format}
                    </p>

                    <h4 className="mt-2 font-semibold">
                      {idea.title}
                    </h4>

                    <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-400">
                      {idea.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-6">
              <h3 className="font-semibold text-blue-300">
                Call to Action
              </h3>

              <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                {aiResult.callToAction}
              </p>
            </div>

            {aiResult.input && (
              <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <h3 className="font-semibold">Input untuk AI</h3>

                <div className="mt-4 space-y-3 text-sm">
                  <p>
                    <span className="text-slate-500">Produk:</span>{" "}
                    {aiResult.input.product || "-"}
                  </p>

                  <p>
                    <span className="text-slate-500">
                      Target audiens:
                    </span>{" "}
                    {aiResult.input.targetAudience || "-"}
                  </p>

                  <p>
                    <span className="text-slate-500">Platform:</span>{" "}
                    {aiResult.input.platform || "-"}
                  </p>

                  <p>
                    <span className="text-slate-500">Tone:</span>{" "}
                    {aiResult.input.tone || "-"}
                  </p>
                </div>
              </section>
            )}
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Belum ada hasil AI tersimpan
            </h2>

            <p className="mt-2 leading-7 text-slate-400">
              Campaign ini tidak memiliki hasil AI yang tersimpan. Kamu
              masih bisa melihat dan mengedit informasi dasarnya.
            </p>
          </section>
        )}

        <div className="mt-8">
          <Link
            href="/dashboard/campaigns"
            className="inline-flex rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
          >
            Kembali ke Campaign Saya
          </Link>
        </div>
      </div>
    </main>
  );
}
