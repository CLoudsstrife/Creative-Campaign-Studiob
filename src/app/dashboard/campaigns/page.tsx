
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import DeleteCampaignButton from "./DeleteCampaignButton";

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
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/dashboard"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Kembali ke Dashboard
        </Link>

        <header className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium tracking-widest text-blue-400">
              CREATIVEFLOW AI
            </p>
            <h1 className="mt-2 text-3xl font-bold">Campaign Saya</h1>
            <p className="mt-2 text-slate-400">
              Kelola semua campaign pemasaranmu di satu tempat.
            </p>
          </div>

          <Link
            href="/dashboard/campaigns/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
          >
            + Buat Campaign
          </Link>
        </header>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Semua Campaign</h2>
            <span className="text-sm text-slate-400">
              {campaigns.length} campaign
            </span>
          </div>

          {campaigns.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
              <h3 className="text-xl font-semibold">
                Belum ada campaign
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                Buat campaign pertamamu untuk mulai mengatur ide,
                target audiens, platform, dan strategi pemasaran.
              </p>
              <Link
                href="/dashboard/campaigns/new"
                className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
              >
                Buat Campaign Pertama
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <article
                  key={campaign.id}
                  className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="break-words text-lg font-semibold">
                      {campaign.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                      {campaign.status}
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-3 min-h-12 text-sm text-slate-400">
                    {campaign.description || "Belum ada deskripsi."}
                  </p>

                  <div className="mt-5 space-y-2 text-sm">
                    {campaign.brandName && (
                      <p className="text-slate-300">
                        <span className="text-slate-500">Brand:</span>{" "}
                        {campaign.brandName}
                      </p>
                    )}

                    {campaign.platform && (
                      <p className="text-slate-300">
                        <span className="text-slate-500">Platform:</span>{" "}
                        {campaign.platform}
                      </p>
                    )}

                    {campaign.targetAudience && (
                      <p className="text-slate-300">
                        <span className="text-slate-500">Target:</span>{" "}
                        {campaign.targetAudience}
                      </p>
                    )}
                  </div>

                  <p className="mt-5 text-xs text-slate-500">
                    Diperbarui{" "}
                    {new Intl.DateTimeFormat("id-ID", {
                      dateStyle: "medium",
                    }).format(campaign.updatedAt)}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-800 pt-4">
                    <Link
                        href={`/dashboard/campaigns/${campaign.id}/edit`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
                    >
                        Edit Campaign
                    </Link>

                    <DeleteCampaignButton campaignId={campaign.id} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
