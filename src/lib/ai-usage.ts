import "server-only";
import { prisma } from "@/lib/prisma";

// This is a cumulative app quota. There is no automatic reset period.
export const AI_GENERATIONS_LIMIT = 10_000;

export async function getAIGenerationCount(userId: string): Promise<number> {
  const usage = await prisma.aIGenerationUsage.findUnique({
    where: { userId },
    select: { generationCount: true },
  });

  return usage?.generationCount ?? 0;
}

export async function recordSuccessfulAIGeneration(
  userId: string,
  usage: { promptTokens?: number; responseTokens?: number }
): Promise<boolean> {
  const promptTokens = Number.isSafeInteger(usage.promptTokens) && (usage.promptTokens ?? 0) > 0
    ? BigInt(usage.promptTokens!)
    : BigInt(0);
  const responseTokens = Number.isSafeInteger(usage.responseTokens) && (usage.responseTokens ?? 0) > 0
    ? BigInt(usage.responseTokens!)
    : BigInt(0);

  const changed = await prisma.$executeRaw`
    INSERT INTO "ai_generation_usage" ("userId", "generationCount", "promptTokenCount", "responseTokenCount", "updatedAt")
    VALUES (${userId}::uuid, 1, ${promptTokens}, ${responseTokens}, NOW())
    ON CONFLICT ("userId") DO UPDATE SET
      "generationCount" = "ai_generation_usage"."generationCount" + 1,
      "promptTokenCount" = "ai_generation_usage"."promptTokenCount" + EXCLUDED."promptTokenCount",
      "responseTokenCount" = "ai_generation_usage"."responseTokenCount" + EXCLUDED."responseTokenCount",
      "updatedAt" = NOW()
    WHERE "ai_generation_usage"."generationCount" < ${AI_GENERATIONS_LIMIT}
  `;

  return changed === 1;
}
