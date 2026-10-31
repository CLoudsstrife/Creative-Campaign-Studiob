
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import DownloadCampaignPDF from "./DownloadCampaignPDF";
import CopyTextButton from "../CopyTextButton";

type Props = {
  params: Promise<{ id: string }>;
};

type ContentIdea = {
  title: string;
  format: string;
  description: string;
  hook?: string;
  concept?: string;
  keyPoints?: string[];
  visualDirection?: string;
  caption?: string;
  callToAction?: string;
  workflowStatus?: "idea" | "draft" | "review" | "ready" | "published";
  scheduledAt?: string;
};

type GroundedSource = {
  title: string;
  url: string;
};

type CampaignAIResult = {
  campaignTitle: string;
  bigIdea: string;
  objective: string;
  keyMessage: string;
  contentIdeas: ContentIdea[];
  callToAction: string;
  selectedIdeaIndex?: number;
  claimsToVerify?: string[];
  sources?: GroundedSource[];
  input?: {
    brandName?: string;
    product?: string;
    targetAudience?: string;
    platform?: string;
    tone?: string;
    brandContext?: string;
    contentPillars?: string;
    editorialRules?: string;
    useGoogleSearch?: boolean;
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
    <main className="app-background min-h-screen px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard/campaigns"
          className="text-sm text-violet-400 hover:text-violet-300"
        >
          ← Kembali ke Campaign Saya
        </Link>

        <header className="mt-6">
          <p className="text-sm font-medium tracking-widest text-violet-400">
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

        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#111019] p-6 sm:p-8">
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
                  className="rounded-lg border border-violet-500/50 px-4 py-2 text-sm font-medium text-violet-300 transition hover:bg-[#7258ff]/10"
                >
                  Edit AI Results
                </Link>
              )}

              <Link
                href={`/dashboard/campaigns/${campaign.id}/edit`}
                className="rounded-lg bg-[#5232ff] px-4 py-2 text-sm font-medium transition hover:bg-[#7258ff]"
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

          <div className="mt-6 border-t border-white/[0.08] pt-5">
            <p className="text-sm text-slate-500">Deskripsi</p>
            <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
              {campaign.description || "Belum ada deskripsi."}
            </p>
          </div>
        </section>

        {aiResult ? (
          <section className="mt-8 space-y-6">
            <div>
              <p className="text-sm font-medium tracking-widest text-violet-400">
                AI GENERATED CAMPAIGN
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {aiResult.campaignTitle}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#111019] p-6 sm:p-8">
              <div>
                <h3 className="font-semibold text-violet-300">
                  Big Idea
                </h3>
                <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                  {aiResult.bigIdea}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-violet-300">
                  Campaign Objective
                </h3>
                <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                  {aiResult.objective}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-violet-300">
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
                    className="rounded-xl border border-white/[0.08] bg-[#111019] p-5"
                  >
                    <p className="text-sm text-violet-400">
                      CONTENT IDEA {index + 1} · {idea.format}
                    </p>

                    <h4 className="mt-2 font-semibold">
                      {idea.title}
                    </h4>

                    <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-400">
                      {idea.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                        Status: {idea.workflowStatus ?? "idea"}
                      </span>
                      {idea.scheduledAt && (
                        <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                          Jadwal: {new Intl.DateTimeFormat("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(new Date(idea.scheduledAt))}
                        </span>
                      )}
                    </div>
                    {aiResult.selectedIdeaIndex === index && (
                      <span className="mt-4 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                        Ide pilihan
                      </span>
                    )}
                    {(idea.hook || idea.concept || idea.keyPoints || idea.visualDirection || idea.caption || idea.callToAction) && (
                      <div className="mt-5 space-y-4 border-t border-white/[0.08] pt-5">
                        {idea.hook && (
                          <div>
                            <h5 className="text-sm font-semibold text-violet-300">Hook pembuka</h5>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.hook}</p>
                          </div>
                        )}
                        {idea.concept && (
                          <div>
                            <h5 className="text-sm font-semibold text-violet-300">Angle dan konsep</h5>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.concept}</p>
                          </div>
                        )}
                        {idea.keyPoints && (
                          <div>
                            <h5 className="text-sm font-semibold text-violet-300">Alur / poin utama</h5>
                            <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-300">
                              {idea.keyPoints.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}
                            </ol>
                          </div>
                        )}
                        {idea.visualDirection && (
                          <div>
                            <h5 className="text-sm font-semibold text-violet-300">Arahan visual</h5>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.visualDirection}</p>
                          </div>
                        )}
                        {idea.caption && (
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h5 className="text-sm font-semibold text-violet-300">Draft caption</h5>
                              <CopyTextButton text={idea.caption} />
                            </div>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.caption}</p>
                          </div>
                        )}
                        {idea.callToAction && (
                          <div>
                            <h5 className="text-sm font-semibold text-violet-300">CTA konten</h5>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.callToAction}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-violet-500/30 bg-[#5232ff]/5 p-6">
              <h3 className="font-semibold text-violet-300">
                Call to Action
              </h3>

              <p className="mt-2 whitespace-pre-wrap leading-7 text-slate-300">
                {aiResult.callToAction}
              </p>
            </div>

            <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
              <h3 className="font-semibold text-amber-200">
                Sumber dan pemeriksaan fakta
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Gunakan tautan ini sebagai titik awal. Pastikan sumber mendukung
                klaim yang dipakai dan periksa sumber asli sebelum publikasi.
              </p>
              {aiResult.claimsToVerify?.length ? (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                  {aiResult.claimsToVerify.map((claim, index) => (
                    <li key={index}>{claim}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Tidak ada klaim khusus yang ditandai untuk diperiksa.
                </p>
              )}
              {aiResult.sources?.length ? (
                <ul className="mt-4 space-y-2 text-sm">
                  {aiResult.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer" className="text-violet-300 underline decoration-violet-300/40 underline-offset-4 hover:text-violet-200">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  Tidak ada sumber web tersimpan untuk campaign ini.
                </p>
              )}
            </section>

            {aiResult.input && (
              <section className="rounded-xl border border-white/[0.08] bg-[#111019] p-5">
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
                  {aiResult.input.brandContext && (
                    <p><span className="text-slate-500">Konteks brand:</span> {aiResult.input.brandContext}</p>
                  )}
                  {aiResult.input.contentPillars && (
                    <p><span className="text-slate-500">Pilar konten:</span> {aiResult.input.contentPillars}</p>
                  )}
                  {aiResult.input.editorialRules && (
                    <p><span className="text-slate-500">Pedoman editorial:</span> {aiResult.input.editorialRules}</p>
                  )}
                </div>
              </section>
            )}
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#111019] p-6">
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
            className="inline-flex rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
          >
            Kembali ke Campaign Saya
          </Link>
        </div>
      </div>
    </main>
  );
}
