"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { saveAICampaign } from "../actions";
import CopyTextButton from "../CopyTextButton";
import AgentProgress from "./AgentProgress";

type ContentIdea = {
  title: string;
  format: string;
  description: string;
  hook: string;
  concept: string;
  keyPoints: string[];
  visualDirection: string;
  caption: string;
  callToAction: string;
  workflowStatus?: "idea" | "draft" | "review" | "ready" | "published";
  scheduledAt?: string;
};

type GroundedSource = {
  title: string;
  url: string;
};

type BrandProfile = {
  brandName: string;
  product: string;
  targetAudience: string;
  platform: string;
  tone: string;
  brandContext: string;
  contentPillars: string;
  editorialRules: string;
  useGoogleSearch: boolean;
  preset?: "bisik";
  topic?: string;
  topicContext?: string;
};

type CampaignResult = {
  campaignTitle: string;
  bigIdea: string;
  objective: string;
  keyMessage: string;
  contentIdeas: ContentIdea[];
  callToAction: string;
  claimsToVerify: string[];
  sources: GroundedSource[];
  selectedIdeaIndex?: number;
  input?: Partial<BrandProfile>;
};

type ApiResponse = {
  result?: CampaignResult;
  error?: string;
};

type BisikPreset = {
  slug: string;
  brandName: string;
  productDescription: string;
  targetAudience: string;
  platform: string;
  tone: string;
  brandContext: string;
  contentPillars: string;
  editorialRules: string;
  defaultGoogleSearch: boolean;
};

const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-[#0b0a11] px-4 py-3 text-white outline-none transition focus:border-violet-500";

const labelClass = "text-sm font-medium text-slate-200";
export default function CampaignGeneratorForm({
  bisikPreset,
}: {
  bisikPreset: BisikPreset | null;
}) {
  const router = useRouter();
  const [isBisikMode, setIsBisikMode] = useState(false);
  const [topic, setTopic] = useState("");
  const [topicContext, setTopicContext] = useState("");
  const [brandName, setBrandName] = useState("");
  const [product, setProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [brandContext, setBrandContext] = useState("");
  const [contentPillars, setContentPillars] = useState("");
  const [editorialRules, setEditorialRules] = useState("");
  const [useGoogleSearch, setUseGoogleSearch] = useState(true);

  const [campaignObjective, setCampaignObjective] =
    useState("Brand Awareness");
  const [customObjective, setCustomObjective] = useState("");

  const [usp, setUsp] = useState("");
  const [audiencePainPoint, setAudiencePainPoint] = useState("");

  const [platform, setPlatform] = useState("Instagram");
  const [customPlatform, setCustomPlatform] = useState("");

  const [tone, setTone] = useState("Friendly");
  const [customTone, setCustomTone] = useState("");

  const [result, setResult] = useState<CampaignResult | null>(null);
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState<number | null>(null);
  const [expandedIdeaIndex, setExpandedIdeaIndex] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  function selectBisikMode() {
    if (!bisikPreset) return;
    setIsBisikMode(true);
    setPlatform(bisikPreset.platform);
    setTone(bisikPreset.tone);
    setUseGoogleSearch(bisikPreset.defaultGoogleSearch);
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading || saving) return;

    const effectiveObjective =
      campaignObjective === "Other"
        ? customObjective.trim()
        : campaignObjective;

    const effectivePlatform =
      platform === "Other" ? customPlatform.trim() : platform;

    const effectiveTone = tone === "Other" ? customTone.trim() : tone;

    if (
      (!isBisikMode && !effectiveObjective) ||
      (isBisikMode && !topic.trim()) ||
      !effectivePlatform ||
      !effectiveTone
    ) {
      setError("Please fill in all custom options that are still empty.");
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError("");
    setResult(null);
    setSelectedIdeaIndex(null);
    setExpandedIdeaIndex(null);
    setSaveMessage("");
    setSaveError("");
    setSaved(false);

    try {
      const response = await fetch("/api/campaigns/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(isBisikMode
            ? {
                preset: "bisik",
                topic: topic.trim(),
                topicContext: topicContext.trim(),
              }
            : {
                brandName: brandName.trim(),
                product: product.trim(),
                targetAudience: targetAudience.trim(),
                campaignObjective: effectiveObjective,
                usp: usp.trim(),
                audiencePainPoint: audiencePainPoint.trim(),
                brandContext: brandContext.trim(),
                contentPillars: contentPillars.trim(),
                editorialRules: editorialRules.trim(),
              }),
          platform: effectivePlatform,
          tone: effectiveTone,
          useGoogleSearch,
        }),
        signal: controller.signal,
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate the campaign.");
      }

      if (!data.result) {
        throw new Error("The AI response did not include a campaign result.");
      }

      setResult(data.result);
      setSelectedIdeaIndex(data.result.selectedIdeaIndex ?? null);
      router.refresh();
    } catch (err) {
      if (controller.signal.aborted) {
        setError("Campaign generation was cancelled.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while contacting the AI."
        );
      }
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setLoading(false);
      }
    }
  }

  function handleCancel() {
    abortControllerRef.current?.abort();
  }

  async function handleSaveCampaign() {
    if (!result || saving || saved) return;

    const effectivePlatform =
      platform === "Other" ? customPlatform.trim() : platform;

    const effectiveTone = tone === "Other" ? customTone.trim() : tone;

    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    try {
      const response = await saveAICampaign({
        brandName: isBisikMode ? bisikPreset!.brandName : brandName.trim(),
        product: isBisikMode ? bisikPreset!.productDescription : product.trim(),
        targetAudience: isBisikMode ? bisikPreset!.targetAudience : targetAudience.trim(),
        platform: effectivePlatform,
        tone: effectiveTone,
        result: {
          ...result,
          ...(selectedIdeaIndex !== null && { selectedIdeaIndex }),
          input: {
            ...result.input,
            brandName: isBisikMode ? bisikPreset!.brandName : brandName.trim(),
            product: isBisikMode ? bisikPreset!.productDescription : product.trim(),
            targetAudience: isBisikMode ? bisikPreset!.targetAudience : targetAudience.trim(),
            platform: effectivePlatform,
            tone: effectiveTone,
            ...(isBisikMode && {
              preset: "bisik" as const,
              topic: topic.trim(),
              topicContext: topicContext.trim(),
              brandContext: bisikPreset!.brandContext,
              contentPillars: bisikPreset!.contentPillars,
              editorialRules: bisikPreset!.editorialRules,
            }),
            ...(!isBisikMode && {
              brandContext: brandContext.trim(),
              contentPillars: contentPillars.trim(),
              editorialRules: editorialRules.trim(),
            }),
            useGoogleSearch,
          },
        },
      });

      if (response.error) {
        setSaveError(response.error);
        return;
      }

      setSaved(true);
      setSaveMessage(response.success ?? "Campaign saved successfully!");
    } catch {
      setSaveError("Something went wrong while saving the campaign.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleGenerate} className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Generator mode">
          <button
            type="button"
            aria-pressed={!isBisikMode}
            onClick={() => setIsBisikMode(false)}
            className={`rounded-xl border p-4 text-left transition ${!isBisikMode ? "border-violet-400/50 bg-violet-500/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"}`}
          >
            <span className="block font-medium text-white">General campaign</span>
            <span className="mt-1 block text-xs text-slate-400">Build a campaign for any brand or product.</span>
          </button>
          <button
            type="button"
            aria-pressed={isBisikMode}
            disabled={!bisikPreset}
            onClick={selectBisikMode}
            className={`rounded-xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${isBisikMode ? "border-violet-400/50 bg-violet-500/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"}`}
          >
            <span className="block font-medium text-white">BISIK post ideas</span>
            <span className="mt-1 block text-xs text-slate-400">Plan discussion content from a topic or occasion.</span>
          </button>
        </div>
        {!bisikPreset && (
          <p role="status" className="text-xs text-amber-300">
            The BISIK preset is unavailable until its database migration has been applied.
          </p>
        )}

        <div className="border-b border-white/[0.07] pb-4">
          <p className="text-[10px] font-semibold tracking-[.18em] text-violet-300">
            {isBisikMode ? "01 / BISIK PRESET" : "01 / BRAND PROFILE"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {isBisikMode
              ? "The BISIK editorial profile is loaded from the database for you."
              : "Introduce your brand and the editorial direction to keep."}
          </p>
        </div>
        {isBisikMode ? (
          <div className="rounded-xl border border-violet-300/15 bg-[#5232ff]/[0.035] p-4">
            <p className="font-medium text-violet-100">{bisikPreset?.brandName}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">{bisikPreset?.brandContext}</p>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="brandName" className={labelClass}>Brand Name *</label>
              <input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
                maxLength={150}
                placeholder="Example: Nusantara Coffee"
                className={inputClass}
              />
            </div>
            <div className="space-y-4 rounded-xl border border-white/10 p-4">
              <div>
                <label htmlFor="brandContext" className={labelClass}>Brand purpose and context</label>
                <textarea id="brandContext" value={brandContext} onChange={(event) => setBrandContext(event.target.value)} maxLength={1200} rows={3} placeholder="Describe the account's purpose, its role, and what you want to bring to your audience." className={inputClass} />
              </div>
              <div>
                <label htmlFor="contentPillars" className={labelClass}>Content pillars</label>
                <textarea id="contentPillars" value={contentPillars} onChange={(event) => setContentPillars(event.target.value)} maxLength={1000} rows={2} placeholder="Example: product education, customer stories, usage tips, or brand community." className={inputClass} />
              </div>
              <div>
                <label htmlFor="editorialRules" className={labelClass}>Editorial guidelines</label>
                <textarea id="editorialRules" value={editorialRules} onChange={(event) => setEditorialRules(event.target.value)} maxLength={1200} rows={3} placeholder="Rules for accuracy, tone, balance, and content boundaries." className={inputClass} />
              </div>
            </div>
          </>
        )}

        <div className="border-b border-white/[0.07] pb-4 pt-2">
          <p className="text-[10px] font-semibold tracking-[.18em] text-violet-300">
            {isBisikMode ? "02 / POST TOPIC" : "02 / CAMPAIGN BRIEF"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {isBisikMode
              ? "Enter the issue, event, or occasion BISIK should create posts about."
              : "Describe the offer, the audience, and the change you want to achieve."}
          </p>
        </div>
        {isBisikMode ? (
          <>
            <div>
              <label htmlFor="bisikTopic" className={labelClass}>Topic or occasion *</label>
              <input
                id="bisikTopic"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                required
                maxLength={500}
                placeholder="Example: National Heroes Day"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="bisikTopicContext" className={labelClass}>Angle or context (optional)</label>
              <textarea
                id="bisikTopicContext"
                value={topicContext}
                onChange={(event) => setTopicContext(event.target.value)}
                maxLength={1000}
                rows={3}
                placeholder="Example: connect the meaning of heroism to issues young people face today."
                className={inputClass}
              />
            </div>
          </>
        ) : (
          <>
        {/* Product or service */}
        <div>
          <label htmlFor="product" className={labelClass}>
            Product or Service *
          </label>
          <textarea
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
            maxLength={1000}
            rows={3}
            placeholder="Describe the product, its strengths, and what you want to promote."
            className={inputClass}
          />
        </div>

        {/* Target audience */}
        <div>
          <label htmlFor="targetAudience" className={labelClass}>
            Target Audience *
          </label>
          <textarea
            id="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            required
            maxLength={500}
            rows={2}
            placeholder="Example: University students aged 18–24."
            className={inputClass}
          />
        </div>

        {/* Campaign objective */}
        <div>
          <label htmlFor="campaignObjective" className={labelClass}>
            Campaign Objective *
          </label>
          <select
            id="campaignObjective"
            value={campaignObjective}
            onChange={(e) => setCampaignObjective(e.target.value)}
            required
            className={inputClass}
          >
            <option value="Brand Awareness">Brand Awareness</option>
            <option value="Engagement">Engagement</option>
            <option value="Website Traffic">Website Traffic</option>
            <option value="Lead Generation">Lead Generation</option>
            <option value="Sales / Conversion">Sales / Conversion</option>
            <option value="Product Launch">Product Launch</option>
            <option value="Customer Retention">Customer Retention</option>
            <option value="Other">Other</option>
          </select>

          {campaignObjective === "Other" && (
            <input
              type="text"
              value={customObjective}
              onChange={(e) => setCustomObjective(e.target.value)}
              placeholder="Enter your campaign objective"
              maxLength={200}
              required
              className={inputClass}
              aria-label="Other campaign objective"
            />
          )}
        </div>

        {/* Unique selling proposition */}
        <div>
          <label htmlFor="usp" className={labelClass}>
            Unique Selling Proposition (Optional)
          </label>
          <textarea
            id="usp"
            value={usp}
            onChange={(e) => setUsp(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="What makes your product uniquely better than the alternatives?"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500">
            Examples: more affordable pricing, eco-friendly materials, or
            faster service.
          </p>
        </div>

        {/* Audience pain point */}
        <div>
          <label htmlFor="audiencePainPoint" className={labelClass}>
            Audience Pain Point (Optional)
          </label>
          <textarea
            id="audiencePainPoint"
            value={audiencePainPoint}
            onChange={(e) => setAudiencePainPoint(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="What problems, needs, or wants does your target audience have?"
            className={inputClass}
          />
        </div>
          </>
        )}

        {/* Platform and tone */}
        <div className="border-b border-white/[0.07] pb-4 pt-2">
          <p className="text-[10px] font-semibold tracking-[.18em] text-violet-300">03 / CHANNEL & VOICE</p>
          <p className="mt-1 text-xs text-slate-500">Decide where the content will run and how it should sound.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="platform" className={labelClass}>
              Platform *
            </label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              required
              className={inputClass}
            >
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Website">Website</option>
              <option value="Multi-platform">Multi-platform</option>
              <option value="Other">Other</option>
            </select>

            {platform === "Other" && (
              <input
                type="text"
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value)}
                placeholder="Enter your platform"
                maxLength={100}
                required
                className={inputClass}
                aria-label="Other platform"
              />
            )}
          </div>

          <div>
            <label htmlFor="tone" className={labelClass}>
              Tone of Voice *
            </label>
            <select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              required
              className={inputClass}
            >
              <option value="Professional">Professional</option>
              <option value="Casual">Casual</option>
              <option value="Friendly">Friendly</option>
              <option value="Funny">Funny</option>
              <option value="Inspirational">Inspirational</option>
              <option value="Persuasive">Persuasive</option>
              <option value="Empathetic">Empathetic</option>
              <option value="Luxury">Luxury</option>
              <option value="Other">Other</option>
            </select>

            {tone === "Other" && (
              <input
                type="text"
                value={customTone}
                onChange={(e) => setCustomTone(e.target.value)}
                placeholder="Enter your tone of voice"
                maxLength={100}
                required
                className={inputClass}
                aria-label="Other tone of voice"
              />
            )}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-[#111019] p-4 text-sm text-slate-300">
          <input type="checkbox" checked={useGoogleSearch} onChange={(event) => setUseGoogleSearch(event.target.checked)} className="mt-1 accent-violet-500" />
          <span>
            Search the web for sources to help with fact-checking
            <span className="mt-1 block text-xs leading-5 text-slate-500">
              {isBisikMode
                ? "Turn this on when the post needs current facts or sources. It is off by default to conserve Google Search quota."
                : "Useful for campaigns that involve data, trends, or current issues. Using search may add API costs."}
            </span>
          </span>
        </label>

        {/* Generation progress */}
        {loading && (
          <div
            className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/[0.09] via-[#111019] to-[#111019] p-5 shadow-[0_16px_50px_-28px_rgba(124,58,237,0.55)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-violet-300/80">
                  AI studio
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Working on {isBisikMode ? "your discussion ideas" : "your campaign"}
                </p>
              </div>
              <AgentProgress
                label={isBisikMode ? "Shaping topic ideas" : "Building your campaign"}
              />
            </div>
            <p className="mt-4 border-t border-white/[0.07] pt-3 text-xs leading-5 text-slate-500">
              Generation time can vary with Gemini availability. Your draft will appear here when it is ready.
            </p>

            <button
              type="button"
              onClick={handleCancel}
              className="mt-4 rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Generation error */}
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || saving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5232ff] px-5 py-3 font-medium transition hover:bg-[#7258ff] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <>
              <span className="animate-spin" aria-hidden="true">
                ⟳
              </span>
              Generating campaign...
            </>
          ) : (
            isBisikMode ? "✨ Generate BISIK post ideas" : "✨ Generate Campaign with AI"
          )}
        </button>
      </form>

      {/* AI-generated result */}
      {result && (
        <section
          aria-live="polite"
          className="mt-10 space-y-6 border-t border-white/[0.08] pt-8"
        >
          <div>
            <p className="text-sm font-medium tracking-widest text-violet-400">
              {isBisikMode ? "BISIK CONTENT IDEAS" : "AI GENERATED CAMPAIGN"}
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {result.campaignTitle}
            </h2>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0b0a11] p-5">
            <h3 className="font-semibold text-violet-300">Big Idea</h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-300">
              {result.bigIdea}
            </p>

            <h3 className="mt-5 font-semibold text-violet-300">
              {isBisikMode ? "Content Goal" : "Campaign Objective"}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-300">
              {result.objective}
            </p>

            <h3 className="mt-5 font-semibold text-violet-300">
              Key Message
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-300">
              {result.keyMessage}
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
            <h3 className="font-semibold text-amber-200">
              Sources and fact-checking
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The sources below come from Google Search grounding. Make sure
              each source actually supports the claim before you publish the
              content.
            </p>

            {result.claimsToVerify.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-amber-100">
                  Claims to verify
                </h4>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-300">
                  {result.claimsToVerify.map((claim, index) => (
                    <li key={index}>{claim}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                The AI didn&apos;t flag any specific claims, but still fact-check before publishing.
              </p>
            )}

            {result.sources.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-amber-100">
                  Web sources
                </h4>
                <ul className="mt-2 space-y-2 text-sm">
                  {result.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-violet-300 underline decoration-violet-300/40 underline-offset-4 hover:text-violet-200"
                      >
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                No web sources were returned for this campaign.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold">Content Ideas</h3>

            <div className="mt-4 grid gap-4">
              {result.contentIdeas.map((idea, index) => (
                <article
                  key={`${idea.title}-${index}`}
                  className={`rounded-xl border bg-[#0b0a11] p-5 transition ${
                    selectedIdeaIndex === index
                      ? "border-emerald-500/60 ring-1 ring-emerald-500/20"
                      : "border-white/[0.08]"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-sm text-violet-400">
                        CONTENT IDEA {index + 1} · {idea.format}
                      </p>
                      <h4 className="mt-2 font-semibold">{idea.title}</h4>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                        {idea.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-expanded={expandedIdeaIndex === index}
                      onClick={() => {
                        setSelectedIdeaIndex(index);
                        setExpandedIdeaIndex((current) =>
                          current === index ? null : index
                        );
                      }}
                      className={`shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition ${
                        selectedIdeaIndex === index
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10"
                      }`}
                    >
                      {selectedIdeaIndex === index
                        ? expandedIdeaIndex === index
                          ? "✓ Selected · Close details"
                          : "✓ Selected · View details"
                        : "Select & view details"}
                    </button>
                  </div>

                  {expandedIdeaIndex === index && (
                    <div className="mt-5 space-y-5 border-t border-white/[0.08] pt-5">
                      <div>
                        <h5 className="text-sm font-semibold text-violet-300">Opening hook</h5>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.hook}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-violet-300">Angle and concept</h5>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.concept}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-violet-300">Flow / key points</h5>
                        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
                          {idea.keyPoints.map((point, pointIndex) => (
                            <li key={`${index}-${pointIndex}`}>{point}</li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-violet-300">Visual direction</h5>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.visualDirection}</p>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="text-sm font-semibold text-violet-300">Caption draft</h5>
                          <CopyTextButton text={idea.caption} />
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.caption}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-violet-300">Content CTA</h5>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{idea.callToAction}</p>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-violet-500/30 bg-[#5232ff]/5 p-5">
            <h3 className="font-semibold text-violet-300">Call to Action</h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-300">
              {result.callToAction}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveCampaign}
              disabled={saving || saved}
              className="rounded-lg bg-[#5232ff] px-4 py-2 text-sm font-medium transition hover:bg-[#7258ff] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : saved
                  ? "✓ Campaign Saved"
                  : "Save Campaign"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
            >
              Print / Save as PDF
            </button>
          </div>

          {saveMessage && (
            <p role="status" className="text-sm text-green-400">
              {saveMessage}
            </p>
          )}

          {saveError && (
            <p role="alert" className="text-sm text-red-400">
              {saveError}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
