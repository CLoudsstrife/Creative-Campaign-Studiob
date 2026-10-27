
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateAICampaign } from "../../actions";

type ContentIdea = {
  title: string;
  format: string;
  description: string;
};

type CampaignAIResult = {
  campaignTitle: string;
  bigIdea: string;
  objective: string;
  keyMessage: string;
  contentIdeas: ContentIdea[];
  callToAction: string;
  input?: {
    brandName?: string;
    product?: string;
    targetAudience?: string;
    platform?: string;
    tone?: string;
  };
};

type Props = {
  campaignId: string;
  initialResult: CampaignAIResult;
};

export default function EditAIForm({
  campaignId,
  initialResult,
}: Props) {
  const router = useRouter();

  const [result, setResult] = useState<CampaignAIResult>(
    () => ({
      ...initialResult,
      contentIdeas: initialResult.contentIdeas.map((idea) => ({
        ...idea,
      })),
      input: initialResult.input
        ? { ...initialResult.input }
        : undefined,
    })
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: "campaignTitle" | "bigIdea" | "objective" | "keyMessage" | "callToAction",
    value: string
  ) {
    setResult((current) => ({
      ...current,
      [field]: value,
    }));
    setError("");
    setSuccess("");
  }

  function updateContentIdea(
    index: number,
    field: keyof ContentIdea,
    value: string
  ) {
    setResult((current) => ({
      ...current,
      contentIdeas: current.contentIdeas.map((idea, i) =>
        i === index ? { ...idea, [field]: value } : idea
      ),
    }));
    setError("");
    setSuccess("");
  }

  function addContentIdea() {
    if (result.contentIdeas.length >= 20) {
      setError("Maksimal 20 content ideas.");
      return;
    }

    setResult((current) => ({
      ...current,
      contentIdeas: [
        ...current.contentIdeas,
        {
          title: "",
          format: "",
          description: "",
        },
      ],
    }));
    setError("");
    setSuccess("");
  }

  function removeContentIdea(index: number) {
    setResult((current) => ({
      ...current,
      contentIdeas: current.contentIdeas.filter(
        (_, i) => i !== index
      ),
    }));
    setError("");
    setSuccess("");
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!result.campaignTitle.trim()) {
      setError("Judul campaign wajib diisi.");
      return;
    }

    if (result.campaignTitle.trim().length > 150) {
      setError("Judul campaign maksimal 150 karakter.");
      return;
    }

    if (
      result.contentIdeas.some(
        (idea) =>
          !idea.title.trim() ||
          !idea.format.trim() ||
          !idea.description.trim()
      )
    ) {
      setError(
        "Lengkapi judul, format, dan deskripsi setiap content idea."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await updateAICampaign({
        campaignId,
        result: {
          ...result,
          campaignTitle: result.campaignTitle.trim(),
          bigIdea: result.bigIdea.trim(),
          objective: result.objective.trim(),
          keyMessage: result.keyMessage.trim(),
          callToAction: result.callToAction.trim(),
          contentIdeas: result.contentIdeas.map((idea) => ({
            title: idea.title.trim(),
            format: idea.format.trim(),
            description: idea.description.trim(),
          })),
        },
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      setSuccess(response.success || "Perubahan berhasil disimpan.");
      router.refresh();
      router.push(`/dashboard/campaigns/${campaignId}`);
    } catch {
      setError("Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500";

  const labelClass = "block text-sm font-medium text-slate-300";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <h2 className="text-xl font-semibold">Campaign Overview</h2>

        <div className="mt-6">
          <label className={labelClass} htmlFor="campaignTitle">
            Campaign Title
          </label>
          <input
            id="campaignTitle"
            className={inputClass}
            value={result.campaignTitle}
            maxLength={150}
            onChange={(e) =>
              updateField("campaignTitle", e.target.value)
            }
            required
          />
        </div>

        <div className="mt-5">
          <label className={labelClass} htmlFor="bigIdea">
            Big Idea
          </label>
          <textarea
            id="bigIdea"
            className={inputClass}
            rows={4}
            value={result.bigIdea}
            onChange={(e) => updateField("bigIdea", e.target.value)}
          />
        </div>

        <div className="mt-5">
          <label className={labelClass} htmlFor="objective">
            Campaign Objective
          </label>
          <textarea
            id="objective"
            className={inputClass}
            rows={3}
            value={result.objective}
            onChange={(e) => updateField("objective", e.target.value)}
          />
        </div>

        <div className="mt-5">
          <label className={labelClass} htmlFor="keyMessage">
            Key Message
          </label>
          <textarea
            id="keyMessage"
            className={inputClass}
            rows={3}
            value={result.keyMessage}
            onChange={(e) => updateField("keyMessage", e.target.value)}
          />
        </div>

        <div className="mt-5">
          <label className={labelClass} htmlFor="callToAction">
            Call to Action
          </label>
          <textarea
            id="callToAction"
            className={inputClass}
            rows={3}
            value={result.callToAction}
            onChange={(e) =>
              updateField("callToAction", e.target.value)
            }
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Content Ideas</h2>
            <p className="mt-1 text-sm text-slate-400">
              {result.contentIdeas.length} dari 20 ide konten
            </p>
          </div>

          <button
            type="button"
            onClick={addContentIdea}
            disabled={result.contentIdeas.length >= 20 || saving}
            className="rounded-lg border border-blue-500/50 px-4 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Add Content Idea
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {result.contentIdeas.map((idea, index) => (
            <article
              key={index}
              className="rounded-xl border border-slate-700 bg-slate-950/60 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">
                  Content Idea {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => removeContentIdea(index)}
                  disabled={saving}
                  className="text-sm text-red-400 transition hover:text-red-300 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>

              <div className="mt-4">
                <label
                  className={labelClass}
                  htmlFor={`idea-title-${index}`}
                >
                  Title
                </label>
                <input
                  id={`idea-title-${index}`}
                  className={inputClass}
                  value={idea.title}
                  onChange={(e) =>
                    updateContentIdea(index, "title", e.target.value)
                  }
                  required
                />
              </div>

              <div className="mt-4">
                <label
                  className={labelClass}
                  htmlFor={`idea-format-${index}`}
                >
                  Format
                </label>
                <input
                  id={`idea-format-${index}`}
                  className={inputClass}
                  placeholder="Contoh: Instagram Reel"
                  value={idea.format}
                  onChange={(e) =>
                    updateContentIdea(index, "format", e.target.value)
                  }
                  required
                />
              </div>

              <div className="mt-4">
                <label
                  className={labelClass}
                  htmlFor={`idea-description-${index}`}
                >
                  Description
                </label>
                <textarea
                  id={`idea-description-${index}`}
                  className={inputClass}
                  rows={3}
                  value={idea.description}
                  onChange={(e) =>
                    updateContentIdea(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                  required
                />
              </div>
            </article>
          ))}

          {result.contentIdeas.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-700 p-5 text-sm text-slate-400">
              Belum ada content idea. Klik Add Content Idea untuk
              menambahkan ide baru.
            </p>
          )}
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
        >
          {success}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>

        <Link
          href={`/dashboard/campaigns/${campaignId}`}
          className="rounded-lg border border-slate-700 px-6 py-3 text-sm font-medium transition hover:bg-slate-800"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
