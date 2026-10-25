
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type CampaignFormState = {
  error?: string;
  success?: string;
};

async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Sesi login tidak valid. Silakan login kembali.");
  }

  return user;
}

export async function createCampaign(
  _previousState: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  try {
    const user = await getAuthenticatedUser();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const brandName = String(formData.get("brandName") ?? "").trim();
    const targetAudience = String(formData.get("targetAudience") ?? "").trim();
    const platform = String(formData.get("platform") ?? "").trim();
    const tone = String(formData.get("tone") ?? "").trim();

    if (!title) {
      return { error: "Judul campaign wajib diisi." };
    }

    if (title.length > 150) {
      return { error: "Judul maksimal 150 karakter." };
    }

    await prisma.campaign.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        brandName: brandName || null,
        targetAudience: targetAudience || null,
        platform: platform || null,
        tone: tone || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/campaigns");

    return { success: "Campaign berhasil dibuat." };
  } catch (error) {
    console.error("createCampaign error:", error);

    return {
      error:
        error instanceof Error &&
        error.message.includes("Sesi login tidak valid")
          ? error.message
          : "Campaign gagal dibuat. Periksa koneksi database dan coba lagi.",
    };
  }
}

export async function deleteCampaign(
  campaignId: string
): Promise<CampaignFormState> {
  try {
    const user = await getAuthenticatedUser();

    if (!campaignId.trim()) {
      return { error: "ID campaign tidak valid." };
    }

    const result = await prisma.campaign.deleteMany({
      where: {
        id: campaignId,
        userId: user.id,
      },
    });

    if (result.count === 0) {
      return {
        error: "Campaign tidak ditemukan atau kamu tidak memiliki akses.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/campaigns");

    return { success: "Campaign berhasil dihapus." };
  } catch (error) {
    console.error("deleteCampaign error:", error);

    return {
      error:
        error instanceof Error &&
        error.message.includes("Sesi login tidak valid")
          ? error.message
          : "Campaign gagal dihapus. Silakan coba lagi.",
    };
  }
}

export async function updateCampaign(
  campaignId: string,
  _previousState: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  try {
    const user = await getAuthenticatedUser();

    if (!campaignId.trim()) {
      return { error: "ID campaign tidak valid." };
    }

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const brandName = String(formData.get("brandName") ?? "").trim();
    const targetAudience = String(formData.get("targetAudience") ?? "").trim();
    const platform = String(formData.get("platform") ?? "").trim();
    const tone = String(formData.get("tone") ?? "").trim();

    if (!title) {
      return { error: "Judul campaign wajib diisi." };
    }

    if (title.length > 150) {
      return { error: "Judul maksimal 150 karakter." };
    }

    const result = await prisma.campaign.updateMany({
      where: {
        id: campaignId,
        userId: user.id,
      },
      data: {
        title,
        description: description || null,
        brandName: brandName || null,
        targetAudience: targetAudience || null,
        platform: platform || null,
        tone: tone || null,
      },
    });

    if (result.count === 0) {
      return {
        error: "Campaign tidak ditemukan atau kamu tidak memiliki akses.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/campaigns");
    revalidatePath(`/dashboard/campaigns/${campaignId}/edit`);

    return { success: "Campaign berhasil diperbarui." };
  } catch (error) {
    console.error("updateCampaign error:", error);

    return {
      error:
        error instanceof Error &&
        error.message.includes("Sesi login tidak valid")
          ? error.message
          : "Campaign gagal diperbarui. Silakan coba lagi.",
    };
  }
}
