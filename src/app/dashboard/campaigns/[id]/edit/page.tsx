
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import EditCampaignForm from "./EditCampaignForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditCampaignPage({ params }: Props) {
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

  return (
    <main className="app-background min-h-screen px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl">
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
          <h1 className="mt-2 text-3xl font-bold">Edit Campaign</h1>
          <p className="mt-2 text-slate-400">
            Perbarui informasi campaign kamu.
          </p>
        </header>

        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#111019] p-6 sm:p-8">
          <EditCampaignForm
            campaign={{
              id: campaign.id,
              title: campaign.title,
              description: campaign.description ?? "",
              brandName: campaign.brandName ?? "",
              targetAudience: campaign.targetAudience ?? "",
              platform: campaign.platform ?? "",
              tone: campaign.tone ?? "",
            }}
          />
        </section>
      </div>
    </main>
  );
}
