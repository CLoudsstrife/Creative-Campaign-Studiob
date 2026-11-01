CREATE TABLE "ai_generation_usage" (
    "userId" UUID NOT NULL,
    "generationCount" INTEGER NOT NULL DEFAULT 0,
    "promptTokenCount" BIGINT NOT NULL DEFAULT 0,
    "responseTokenCount" BIGINT NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_generation_usage_pkey" PRIMARY KEY ("userId")
);
