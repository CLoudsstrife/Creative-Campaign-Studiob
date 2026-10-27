
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import CampaignFilters from "./CampaignFilters";

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

            <h1 className="mt-2 text-3xl font-bold">
              Campaign Saya
            </h1>

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
          {campaigns.length === 0 ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Semua Campaign
                </h2>

                <span className="text-sm text-slate-400">
                  0 campaign
                </span>
              </div>

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
                  className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
                >
                  Buat Campaign Pertama
                </Link>
              </div>
            </>
          ) : (
            <CampaignFilters campaigns={campaigns} />
          )}
        </section>
      </div>
    </main>
  );
}
