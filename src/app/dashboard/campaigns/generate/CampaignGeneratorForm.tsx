
"use client";

import { useState, type FormEvent } from "react";

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

export default function CampaignGeneratorForm() {
  const [brandName, setBrandName] = useState("");
  const [product, setProduct] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState("Friendly");

  const [result, setResult] = useState<CampaignResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/campaigns/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandName,
          product,
          targetAudience,
          platform,
          tone,
        }),
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat campaign.");
      }

      if (!data.result) {
        throw new Error("Respons AI tidak memiliki hasil campaign.");
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghubungi AI."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleGenerate} className="space-y-5">
        <div>
          <label htmlFor="brandName" className="text-sm font-medium">
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

        <div>
          <label htmlFor="product" className="text-sm font-medium">
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

        <div>
          <label htmlFor="targetAudience" className="text-sm font-medium">
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="platform" className="text-sm font-medium">
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
            </select>
          </div>

          <div>
            <label htmlFor="tone" className="text-sm font-medium">
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
            </select>
          </div>
        </div>

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
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? (
            <>
              <span className="animate-spin">⟳</span>
              Sedang membuat campaign...
            </>
          ) : (
            "✨ Generate Campaign with AI"
          )}
        </button>
      </form>

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
            <h3 className="font-semibold text-blue-300">
              Call to Action
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-slate-300">
              {result.callToAction}
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
          >
            Print / Save as PDF
          </button>
        </section>
      )}
    </div>
  );
}
