CREATE TABLE "campaign_presets" (
    "slug" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "productDescription" TEXT NOT NULL,
    "targetAudience" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'Instagram',
    "tone" TEXT NOT NULL DEFAULT 'Friendly',
    "brandContext" TEXT NOT NULL,
    "contentPillars" TEXT NOT NULL,
    "editorialRules" TEXT NOT NULL,
    "defaultGoogleSearch" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_presets_pkey" PRIMARY KEY ("slug")
);

INSERT INTO "campaign_presets" (
    "slug",
    "brandName",
    "productDescription",
    "targetAudience",
    "platform",
    "tone",
    "brandContext",
    "contentPillars",
    "editorialRules",
    "defaultGoogleSearch",
    "updatedAt"
) VALUES (
    'bisik',
    'BISIK by BEM Petra',
    'A discussion and educational platform for social, political, national, and current issues.',
    'Petra students, university students in Surabaya, and young people who want to understand social and political issues in clear language.',
    'Instagram',
    'Friendly',
    'BISIK by BEM Petra is a platform for thoughtful discussion about social and political issues, national affairs, and current events. Help young people understand the context, consider different perspectives, and take part in constructive discussion.',
    'Social and political issue literacy; national identity and civic life; policy impacts on students and young people; local issues in Surabaya and East Java; media literacy and fact-checking; youth dialogue and participation.',
    'Separate verified facts, context, interpretation, and opinion. Avoid sensationalism, unsupported claims, and personal attacks. Represent relevant viewpoints fairly. Do not invent statistics, quotations, policies, or current events. Flag claims that need verification before publication. Invite respectful discussion.',
    false,
    CURRENT_TIMESTAMP
);
