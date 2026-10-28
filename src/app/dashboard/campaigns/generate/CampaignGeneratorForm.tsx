
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { saveAICampaign } from "../actions";

type ContentIdea = {
  title: string;
  format: string;
  description: string;
};

type CampaignResult = {
  campaignTitle: string;
  bigIdea: string;
  objective: string;
  keyMessage: string;
  contentIdeas: ContentIdea[];
  callToAction: string;
};

type ApiResponse = {
  result?: CampaignResult;
  error?: string;
};

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500";

const labelClass = "text-sm font-medium text-slate-200";

export default function CampaignGeneratorForm() {
  const [brandName, setBrandName] = useState("");
  const [product, setProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!loading) return;

    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current < 30) return Math.min(current + 3, 30);
        if (current < 60) return Math.min(current + 1.5, 60);
        if (current < 80) return Math.min(current + 0.5, 80);
        if (current < 90) return Math.min(current + 0.15, 90);
        return current;
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [loading]);

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

    if (!effectiveObjective || !effectivePlatform || !effectiveTone) {
      setError("Mohon isi semua pilihan khusus yang masih kosong.");
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setProgress(0);
    setError("");
    setResult(null);
    setSaveMessage("");
    setSaveError("");
    setSaved(false);

    try {
      setProgress(10);

      const response = await fetch("/api/campaigns/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName: brandName.trim(),
          product: product.trim(),
          targetAudience: targetAudience.trim(),
          campaignObjective: effectiveObjective,
          usp: usp.trim(),
          audiencePainPoint: audiencePainPoint.trim(),
          platform: effectivePlatform,
          tone: effectiveTone,
        }),
        signal: controller.signal,
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat campaign.");
      }

      if (!data.result) {
        throw new Error("Respons AI tidak memiliki hasil campaign.");
      }

      setProgress(100);
      setResult(data.result);
    } catch (err) {
      if (controller.signal.aborted) {
        setError("Pembuatan campaign dibatalkan.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat menghubungi AI."
        );
      }

      setProgress(0);
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
        brandName: brandName.trim(),
        product: product.trim(),
        targetAudience: targetAudience.trim(),
        platform: effectivePlatform,
        tone: effectiveTone,
        result,
      });

      if (response.error) {
        setSaveError(response.error);
        return;
      }

      setSaved(true);
      setSaveMessage(response.success ?? "Campaign berhasil disimpan!");
    } catch {
      setSaveError("Terjadi kesalahan saat menyimpan campaign.");
    } finally {
      setSaving(false);
    }
  }

  const progressStage =
    progress < 30
      ? "Menyiapkan request..."
      : progress < 90
        ? "Gemini sedang membuat campaign..."
        : "Menunggu hasil dari AI...";

  return (
    <div>
      <form onSubmit={handleGenerate} className="space-y-5">
        {/* Brand name */}
        <div>
          <label htmlFor="brandName" className={labelClass}>
            Nama Brand *
          </label>
          <input
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
            maxLength={150}
            placeholder="Contoh: Kopi Nusantara"
            className={inputClass}
          />
        </div>

        {/* Product or service */}
        <div>
          <label htmlFor="product" className={labelClass}>
            Produk atau Layanan *
          </label>
          <textarea
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
            maxLength={1000}
            rows={3}
            placeholder="Jelaskan produk, keunggulan, dan hal yang ingin dipromosikan."
            className={inputClass}
          />
        </div>

        {/* Target audience */}
        <div>
          <label htmlFor="targetAudience" className={labelClass}>
            Target Audiens *
          </label>
          <textarea
            id="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            required
            maxLength={500}
            rows={2}
            placeholder="Contoh: Mahasiswa usia 18–24 tahun."
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
              placeholder="Masukkan tujuan campaign"
              maxLength={200}
              required
              className={inputClass}
              aria-label="Tujuan campaign lainnya"
            />
          )}
        </div>

        {/* Unique selling proposition */}
        <div>
          <label htmlFor="usp" className={labelClass}>
            Unique Selling Proposition (Opsional)
          </label>
          <textarea
            id="usp"
            value={usp}
            onChange={(e) => setUsp(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Apa keunggulan unik produk dibandingkan alternatif lain?"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500">
            Contoh: harga lebih terjangkau, bahan ramah lingkungan, atau
            layanan lebih cepat.
          </p>
        </div>

        {/* Audience pain point */}
        <div>
          <label htmlFor="audiencePainPoint" className={labelClass}>
            Audience Pain Point (Opsional)
          </label>
          <textarea
            id="audiencePainPoint"
            value={audiencePainPoint}
            onChange={(e) => setAudiencePainPoint(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Apa masalah, kebutuhan, atau keinginan target audiens?"
            className={inputClass}
          />
        </div>

        {/* Platform and tone */}
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
                placeholder="Masukkan platform pilihanmu"
                maxLength={100}
                required
                className={inputClass}
                aria-label="Platform lainnya"
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
                placeholder="Masukkan tone of voice pilihanmu"
                maxLength={100}
                required
                className={inputClass}
                aria-label="Tone of voice lainnya"
              />
            )}
          </div>
        </div>

        {/* Generation progress */}
        {loading && (
          <div
            className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-blue-300">
                Generating your campaign
              </p>
              <span className="text-lg font-bold tabular-nums text-blue-300">
                {Math.floor(progress)}%
              </span>
            </div>

            <div
              className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800"
              role="progressbar"
              aria-label="Estimasi progres pembuatan campaign"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.floor(progress)}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-500 transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-3 text-sm text-slate-300">{progressStage}</p>
            <p className="mt-1 text-xs text-slate-500">
              Persentase merupakan estimasi. Kamu bisa membatalkan proses jika
              terlalu lama.
            </p>

            <button
              type="button"
              onClick={handleCancel}
              className="mt-4 rounded-lg border border-red-500/50 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
            >
              Batal
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
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <>
              <span className="animate-spin" aria-hidden="true">
                ⟳
              </span>
              Sedang membuat campaign...
            </>
          ) : (
            "✨ Generate Campaign with AI"
          )}
        </button>
      </form>

      {/* AI-generated result */}
      {result && (
        <section
          aria-live="polite"
          className="mt-10 space-y-6 border-t border-slate-800 pt-8"
        >
          <div>
            <p className="text-sm font-medium tracking-widest text-blue-400">
              AI GENERATED CAMPAIGN
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              {result.campaignTitle}
            </h2>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <h3 className="font-semibold text-blue-300">Big Idea</h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-300">
              {result.bigIdea}
            </p>

            <h3 className="mt-5 font-semibold text-blue-300">
              Campaign Objective
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-300">
              {result.objective}
            </p>

            <h3 className="mt-5 font-semibold text-blue-300">
              Key Message
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-300">
              {result.keyMessage}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold">Content Ideas</h3>

            <div className="mt-4 grid gap-4">
              {result.contentIdeas.map((idea, index) => (
                <article
                  key={`${idea.title}-${index}`}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                >
                  <p className="text-sm text-blue-400">
                    CONTENT IDEA {index + 1} · {idea.format}
                  </p>

                  <h4 className="mt-2 font-semibold">{idea.title}</h4>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-400">
                    {idea.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
            <h3 className="font-semibold text-blue-300">Call to Action</h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-300">
              {result.callToAction}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveCampaign}
              disabled={saving || saved}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Menyimpan..."
                : saved
                  ? "✓ Campaign Tersimpan"
                  : "Save Campaign"}
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
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
