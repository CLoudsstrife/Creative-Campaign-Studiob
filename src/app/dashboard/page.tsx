
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import LogoutButton from "./LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Ambil statistik campaign milik pengguna yang sedang login.
  const [totalCampaigns, draftCampaigns, aiCampaigns, recentCampaigns] =
    await Promise.all([
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
        take: 5,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          aiResult: true,
        },
      }),
    ]);

  const stats = [
    {
      title: "Total Campaign",
      value: totalCampaigns,
      description: "Semua campaign milikmu",
    },
    {
      title: "Campaign Draft",
      value: draftCampaigns,
      description: "Campaign berstatus draft",
    },
    {
      title: "AI-Generated",
      value: aiCampaigns,
      description: "Campaign yang memiliki hasil AI",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-blue-400">
              CREATIVEFLOW AI
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Selamat datang kembali di CreativeFlow AI.
            </p>
          </div>

          <LogoutButton />
        </header>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Akun kamu</h2>

          <p className="mt-3 text-sm text-slate-400">
            Email yang sedang login
          </p>

          <p className="mt-1 break-all font-medium">
            {user.email}
          </p>

          <div className="mt-5 inline-flex rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-400">
            Authentication aktif
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Ringkasan Campaign
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Statistik campaign yang tersimpan di akunmu.
              </p>
            </div>

            <Link
              href="/dashboard/campaigns"
              className="inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
            >
              Lihat Semua Campaign
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm text-slate-400">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-bold">
                  {stat.value}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                AI Campaign Generator
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Buat ide campaign dan konten pemasaran menggunakan AI.
              </p>
            </div>

            <Link
              href="/dashboard/campaigns/generate"
              className="inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
            >
              Generate Campaign
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Aktivitas Terbaru
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Lima campaign terakhir yang dibuat atau diperbarui.
              </p>
            </div>

            <Link
              href="/dashboard/campaigns/new"
              className="text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              + Campaign Baru
            </Link>
          </div>

          {recentCampaigns.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="font-medium">
                Belum ada campaign
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Buat campaign pertamamu untuk mulai menggunakan CreativeFlow AI.
              </p>

              <Link
                href="/dashboard/campaigns/new"
                className="mt-5 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
              >
                Buat Campaign
              </Link>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-800">
              {recentCampaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="flex flex-col justify-between gap-3 py-4 transition hover:bg-slate-800/40 sm:flex-row sm:items-center sm:px-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {campaign.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Diperbarui{" "}
                      {new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(campaign.updatedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {campaign.status}
                    </span>

                    {campaign.aiResult && (
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                        AI
                      </span>
                    )}

                    <span className="text-sm text-slate-400">
                      Lihat →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
