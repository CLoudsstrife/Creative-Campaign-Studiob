
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type CampaignFormState = {
  error?: string;
  success?: string;
};

const LIMITS = {
  title: 150,
  description: 3000,
  brandName: 150,
  product: 1000,
  targetAudience: 500,
  platform: 100,
  tone: 100,
  objective: 1000,
  keyMessage: 1000,
  callToAction: 500,
  ideaTitle: 150,
  ideaFormat: 100,
  ideaDescription: 1000,
  contentIdeas: 20,
};

type CampaignInputFields = {
  brandName: string;
  product: string;
  targetAudience: string;
  platform: string;
  tone: string;
};

type ContentIdea = {
  title: string;
  format: string;
  description: string;
};

type AIResult = {
  campaignTitle: string;
  bigIdea: string;
  objective: string;
  keyMessage: string;
  contentIdeas: ContentIdea[];
  callToAction: string;
  input?: Partial<CampaignInputFields>;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function readFormText(
  formData: FormData,
  key: string
): string | null {
  const value = formData.get(key);

  if (value === null) {
    return "";
  }

  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function readFormFields(formData: FormData) {
  const keys = [
    "title",
    "description",
    "brandName",
    "targetAudience",
    "platform",
    "tone",
  ] as const;

  const values: Record<string, string> = {};

  for (const key of keys) {
    const value = readFormText(formData, key);

    if (value === null) {
      return null;
    }

    values[key] = value;
  }

  return values;
}

function validateCampaignFields(
  fields: Record<string, string>
) {
  if (!fields.title) {
    return "Judul campaign wajib diisi.";
  }

  const limits: Record<string, number> = {
    title: LIMITS.title,
    description: LIMITS.description,
    brandName: LIMITS.brandName,
    targetAudience: LIMITS.targetAudience,
    platform: LIMITS.platform,
    tone: LIMITS.tone,
  };

  const labels: Record<string, string> = {
    title: "Judul",
    description: "Deskripsi",
    brandName: "Nama brand",
    targetAudience: "Target audience",
    platform: "Platform",
    tone: "Tone",
  };

  for (const [field, maxLength] of Object.entries(limits)) {
    if (fields[field].length > maxLength) {
      return `${labels[field]} maksimal ${maxLength} karakter.`;
    }
  }

  return null;
}

function validateAIResult(value: unknown): value is AIResult {
  if (!isRecord(value)) {
    return false;
  }

  const requiredFields: Record<string, number> = {
    campaignTitle: LIMITS.title,
    bigIdea: LIMITS.description,
    objective: LIMITS.objective,
    keyMessage: LIMITS.keyMessage,
    callToAction: LIMITS.callToAction,
  };

  // Semua field utama wajib diisi.
  for (const [field, maxLength] of Object.entries(requiredFields)) {
    const text = value[field];

    if (
      typeof text !== "string" ||
      !text.trim() ||
      text.trim().length > maxLength
    ) {
      return false;
    }
  }

  // Content ideas harus berupa array dan maksimal 20 item.
  if (
    !Array.isArray(value.contentIdeas) ||
    value.contentIdeas.length > LIMITS.contentIdeas
  ) {
    return false;
  }

  // Semua field setiap content idea wajib diisi.
  for (const idea of value.contentIdeas) {
    if (!isRecord(idea)) {
      return false;
    }

    const ideaFields = [
      ["title", LIMITS.ideaTitle],
      ["format", LIMITS.ideaFormat],
      ["description", LIMITS.ideaDescription],
    ] as const;

    for (const [field, maxLength] of ideaFields) {
      const text = idea[field];

      if (
        typeof text !== "string" ||
        !text.trim() ||
        text.trim().length > maxLength
      ) {
        return false;
      }
    }
  }

  // Field input tambahan bersifat opsional.
  // Jika diberikan, tipe dan panjangnya tetap harus valid.
  if (value.input !== undefined) {
    if (!isRecord(value.input)) {
      return false;
    }

    const inputLimits: Record<string, number> = {
      brandName: LIMITS.brandName,
      product: LIMITS.product,
      targetAudience: LIMITS.targetAudience,
      platform: LIMITS.platform,
      tone: LIMITS.tone,
    };

    for (const [field, maxLength] of Object.entries(inputLimits)) {
      const fieldValue = value.input[field];

      if (
        fieldValue !== undefined &&
        (typeof fieldValue !== "string" ||
          fieldValue.length > maxLength)
      ) {
        return false;
      }
    }
  }

  return true;
}

function normalizeAIResult(result: AIResult): AIResult {
  return {
    campaignTitle: result.campaignTitle.trim(),
    bigIdea: result.bigIdea.trim(),
    objective: result.objective.trim(),
    keyMessage: result.keyMessage.trim(),
    contentIdeas: result.contentIdeas.map((idea) => ({
      title: idea.title.trim(),
      format: idea.format.trim(),
      description: idea.description.trim(),
    })),
    callToAction: result.callToAction.trim(),
    ...(result.input !== undefined && {
      input: {
        ...(result.input.brandName !== undefined && {
          brandName: result.input.brandName.trim(),
        }),
        ...(result.input.product !== undefined && {
          product: result.input.product.trim(),
        }),
        ...(result.input.targetAudience !== undefined && {
          targetAudience: result.input.targetAudience.trim(),
        }),
        ...(result.input.platform !== undefined && {
          platform: result.input.platform.trim(),
        }),
        ...(result.input.tone !== undefined && {
          tone: result.input.tone.trim(),
        }),
      },
    }),
  };
}

function isValidCampaignId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= 200
  );
}

function getActionError(error: unknown, fallback: string) {
  console.error(fallback, error);

  if (
    error instanceof Error &&
    error.message.includes("Sesi login tidak valid")
  ) {
    return error.message;
  }

  return fallback;
}

export async function createCampaign(
  _previousState: CampaignFormState,
  formData: FormData
): Promise<CampaignFormState> {
  try {
    const user = await getAuthenticatedUser();
    const fields = readFormFields(formData);

    if (!fields) {
      return { error: "Format input campaign tidak valid." };
    }

    const validationError = validateCampaignFields(fields);

    if (validationError) {
      return { error: validationError };
    }

    await prisma.campaign.create({
      data: {
        userId: user.id,
        title: fields.title,
        description: fields.description || null,
        brandName: fields.brandName || null,
        targetAudience: fields.targetAudience || null,
        platform: fields.platform || null,
        tone: fields.tone || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/campaigns");

    return { success: "Campaign berhasil dibuat." };
  } catch (error) {
    return {
      error: getActionError(
        error,
        "Campaign gagal dibuat. Periksa koneksi database dan coba lagi."
      ),
    };
  }
}

export async function deleteCampaign(
  campaignId: string
): Promise<CampaignFormState> {
  try {
    const user = await getAuthenticatedUser();

    if (!isValidCampaignId(campaignId)) {
      return { error: "ID campaign tidak valid." };
    }

    const result = await prisma.campaign.deleteMany({
      where: {
        id: campaignId.trim(),
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
    return {
      error: getActionError(
        error,
        "Campaign gagal dihapus. Silakan coba lagi."
      ),
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

    if (!isValidCampaignId(campaignId)) {
      return { error: "ID campaign tidak valid." };
    }

    const fields = readFormFields(formData);

    if (!fields) {
      return { error: "Format input campaign tidak valid." };
    }

    const validationError = validateCampaignFields(fields);

    if (validationError) {
      return { error: validationError };
    }

    const result = await prisma.campaign.updateMany({
      where: {
        id: campaignId.trim(),
        userId: user.id,
      },
      data: {
        title: fields.title,
        description: fields.description || null,
        brandName: fields.brandName || null,
        targetAudience: fields.targetAudience || null,
        platform: fields.platform || null,
        tone: fields.tone || null,
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
    return {
      error: getActionError(
        error,
        "Campaign gagal diperbarui. Silakan coba lagi."
      ),
    };
  }
}

export async function saveAICampaign(
  input: {
    brandName: string;
    product: string;
    targetAudience: string;
    platform: string;
    tone: string;
    result: AIResult;
  }
): Promise<CampaignFormState> {
  try {
    const user = await getAuthenticatedUser();

    if (!isRecord(input)) {
      return { error: "Format input campaign tidak valid." };
    }

    const inputLimits = {
      brandName: LIMITS.brandName,
      product: LIMITS.product,
      targetAudience: LIMITS.targetAudience,
      platform: LIMITS.platform,
      tone: LIMITS.tone,
    } as const;

    const cleaned: Record<string, string> = {};

    for (const field of Object.keys(inputLimits) as Array<
      keyof typeof inputLimits
    >) {
      const maxLength = inputLimits[field];
      const value = input[field];

      if (
        typeof value !== "string" ||
        !value.trim() ||
        value.trim().length > maxLength
      ) {
        return {
          error: `Input ${field} wajib diisi dan maksimal ${maxLength} karakter.`,
        };
      }

      cleaned[field] = value.trim();
    }

    if (!validateAIResult(input.result)) {
      return { error: "Format hasil AI tidak valid." };
    }

    const result = normalizeAIResult(input.result);

    const aiResult = JSON.stringify({
      ...result,
      input: {
        brandName: cleaned.brandName,
        product: cleaned.product,
        targetAudience: cleaned.targetAudience,
        platform: cleaned.platform,
        tone: cleaned.tone,
      },
    });

    await prisma.campaign.create({
      data: {
        userId: user.id,
        title: result.campaignTitle,
        description: result.bigIdea || null,
        brandName: cleaned.brandName,
        targetAudience: cleaned.targetAudience,
        platform: cleaned.platform,
        tone: cleaned.tone,
        status: "draft",
        aiResult,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/campaigns");

    return { success: "Campaign AI berhasil disimpan!" };
  } catch (error) {
    return {
      error: getActionError(
        error,
        "Campaign gagal disimpan. Silakan coba lagi."
      ),
    };
  }
}

export async function updateAICampaign(
  input: {
    campaignId: string;
    result: AIResult;
  }
): Promise<CampaignFormState> {
  try {
    const user = await getAuthenticatedUser();

    if (!isRecord(input) || !isValidCampaignId(input.campaignId)) {
      return { error: "ID campaign tidak valid." };
    }

    if (!validateAIResult(input.result)) {
      return { error: "Format hasil AI tidak valid." };
    }

    const campaignId = input.campaignId.trim();
    const result = normalizeAIResult(input.result);
    const aiResult = JSON.stringify(result);

    const updateData = {
      title: result.campaignTitle,
      description: result.bigIdea || null,
      aiResult,
      ...(result.input?.brandName !== undefined && {
        brandName: result.input.brandName || null,
      }),
      ...(result.input?.targetAudience !== undefined && {
        targetAudience: result.input.targetAudience || null,
      }),
      ...(result.input?.platform !== undefined && {
        platform: result.input.platform || null,
      }),
      ...(result.input?.tone !== undefined && {
        tone: result.input.tone || null,
      }),
    };

    const updated = await prisma.campaign.updateMany({
      where: {
        id: campaignId,
        userId: user.id,
      },
      data: updateData,
    });

    if (updated.count === 0) {
      return {
        error: "Campaign tidak ditemukan atau kamu tidak memiliki akses.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/campaigns");
    revalidatePath(`/dashboard/campaigns/${campaignId}`);
    revalidatePath(`/dashboard/campaigns/${campaignId}/edit`);

    return { success: "Hasil AI berhasil diperbarui!" };
  } catch (error) {
    return {
      error: getActionError(
        error,
        "Hasil AI gagal diperbarui. Silakan coba lagi."
      ),
    };
  }
}
