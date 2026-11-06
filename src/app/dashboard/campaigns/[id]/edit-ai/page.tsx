
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import EditAIForm from "./EditAIForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAIPage({ params }: Props) {
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

  if (!campaign.aiResult) {
    return (
      <main className="min-h-[calc(100vh-100px)] px-5 py-7 text-white sm:px-7 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#111019] p-6">
          <h1 className="text-2xl font-bold">
            Hasil AI tidak ditemukan
          </h1>

          <p className="mt-3 text-slate-400">
            Campaign ini belum memiliki hasil AI yang tersimpan.
          </p>

          <a
            href={`/dashboard/campaigns/${campaign.id}`}
            className="mt-5 inline-block text-violet-400 hover:text-violet-300"
          >
            Kembali ke detail campaign
          </a>
        </div>
      </main>
    );
  }

  let aiResult;

  try {
    aiResult = JSON.parse(campaign.aiResult);
  } catch {
    notFound();
  }

  if (
    !aiResult ||
    typeof aiResult !== "object" ||
    typeof aiResult.campaignTitle !== "string" ||
    typeof aiResult.bigIdea !== "string" ||
    typeof aiResult.objective !== "string" ||
    typeof aiResult.keyMessage !== "string" ||
    typeof aiResult.callToAction !== "string" ||
    !Array.isArray(aiResult.contentIdeas) ||
    !aiResult.contentIdeas.every(
      (idea: unknown) =>
        typeof idea === "object" &&
        idea !== null &&
        "title" in idea &&
        "format" in idea &&
        "description" in idea &&
        typeof idea.title === "string" &&
        typeof idea.format === "string" &&
        typeof idea.description === "string"
    )
  ) {
    notFound();
  }

  return (
    <main className="min-h-[calc(100vh-100px)] px-5 py-7 text-white sm:px-7 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-[10px] font-semibold tracking-[.18em] text-violet-300">
          CREATIVE STUDIO
        </p>

        <h1 className="font-ui mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Edit AI Results
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Ubah hasil campaign sesuai kebutuhanmu, lalu simpan perubahan.
        </p>

        <div className="mt-8">
          <EditAIForm
            campaignId={campaign.id}
            initialResult={aiResult}
          />
        </div>
      </div>
    </main>
  );
}
