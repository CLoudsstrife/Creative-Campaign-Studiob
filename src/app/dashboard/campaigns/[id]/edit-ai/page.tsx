
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
      <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">
            Hasil AI tidak ditemukan
          </h1>

          <p className="mt-3 text-slate-400">
            Campaign ini belum memiliki hasil AI yang tersimpan.
          </p>

          <a
            href={`/dashboard/campaigns/${campaign.id}`}
            className="mt-5 inline-block text-blue-400 hover:text-blue-300"
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
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium tracking-widest text-blue-400">
          CREATIVEFLOW AI
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          Edit AI Results
        </h1>

        <p className="mt-2 text-slate-400">
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
