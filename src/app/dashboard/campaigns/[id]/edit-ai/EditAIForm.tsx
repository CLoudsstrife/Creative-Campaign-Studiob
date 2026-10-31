
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateAICampaign } from "../../actions";
import CopyTextButton from "../../CopyTextButton";

type ContentWorkflowStatus =
  | "idea"
  | "draft"
  | "review"
  | "ready"
  | "published";

type ContentIdea = {
  title: string;
  format: string;
  description: string;
  hook?: string;
  concept?: string;
  keyPoints?: string[];
  visualDirection?: string;
  caption?: string;
  callToAction?: string;
  workflowStatus?: ContentWorkflowStatus;
  scheduledAt?: string;
};

type GroundedSource = {
  title: string;
  url: string;
};

type CampaignAIResult = {
  campaignTitle: string;
  bigIdea: string;
  objective: string;
  keyMessage: string;
  contentIdeas: ContentIdea[];
  callToAction: string;
  selectedIdeaIndex?: number;
  claimsToVerify?: string[];
  sources?: GroundedSource[];
  input?: {
    brandName?: string;
    product?: string;
    targetAudience?: string;
    platform?: string;
    tone?: string;
    brandContext?: string;
    contentPillars?: string;
    editorialRules?: string;
    useGoogleSearch?: boolean;
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

  function updateContentIdea<K extends keyof ContentIdea>(
    index: number,
    field: K,
    value: ContentIdea[K]
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

  function toDateTimeLocal(value?: string) {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60_000
    );

    return localDate.toISOString().slice(0, 16);
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
          workflowStatus: "idea",
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
      ...(current.selectedIdeaIndex !== undefined && {
        selectedIdeaIndex:
          current.selectedIdeaIndex === index
            ? undefined
            : current.selectedIdeaIndex > index
              ? current.selectedIdeaIndex - 1
              : current.selectedIdeaIndex,
      }),
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
            ...idea,
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
    "mt-2 w-full rounded-lg border border-white/10 bg-[#0b0a11] px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500";

  const labelClass = "block text-sm font-medium text-slate-300";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/[0.08] bg-[#111019] p-6 sm:p-8">
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

      <section className="rounded-2xl border border-white/[0.08] bg-[#111019] p-6 sm:p-8">
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
            className="rounded-lg border border-violet-500/50 px-4 py-2 text-sm font-medium text-violet-300 transition hover:bg-[#7258ff]/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + Add Content Idea
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {result.contentIdeas.map((idea, index) => (
            <article
              key={index}
              className="rounded-xl border border-white/10 bg-[#0b0a11]/60 p-5"
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

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor={`idea-status-${index}`}>
                    Status produksi
                  </label>
                  <select
                    id={`idea-status-${index}`}
                    className={inputClass}
                    value={idea.workflowStatus ?? "idea"}
                    onChange={(event) =>
                      updateContentIdea(
                        index,
                        "workflowStatus",
                        event.target.value as ContentWorkflowStatus
                      )
                    }
                  >
                    <option value="idea">Ide</option>
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="ready">Siap diposting</option>
                    <option value="published">Sudah diposting</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor={`idea-schedule-${index}`}>
                    Jadwal publikasi
                  </label>
                  <input
                    id={`idea-schedule-${index}`}
                    type="datetime-local"
                    className={inputClass}
                    value={toDateTimeLocal(idea.scheduledAt)}
                    onChange={(event) =>
                      updateContentIdea(
                        index,
                        "scheduledAt",
                        event.target.value
                          ? new Date(event.target.value).toISOString()
                          : undefined
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-white/[0.08] p-4">
                <h4 className="font-semibold text-violet-300">Brief produksi</h4>

                <div className="mt-4">
                  <label className={labelClass} htmlFor={`idea-hook-${index}`}>
                    Hook pembuka
                  </label>
                  <textarea
                    id={`idea-hook-${index}`}
                    className={inputClass}
                    rows={2}
                    maxLength={300}
                    value={idea.hook ?? ""}
                    onChange={(event) =>
                      updateContentIdea(index, "hook", event.target.value)
                    }
                  />
                </div>

                <div className="mt-4">
                  <label className={labelClass} htmlFor={`idea-concept-${index}`}>
                    Angle dan konsep
                  </label>
                  <textarea
                    id={`idea-concept-${index}`}
                    className={inputClass}
                    rows={3}
                    maxLength={1400}
                    value={idea.concept ?? ""}
                    onChange={(event) =>
                      updateContentIdea(index, "concept", event.target.value)
                    }
                  />
                </div>

                <div className="mt-4">
                  <label className={labelClass} htmlFor={`idea-points-${index}`}>
                    Alur / poin utama (satu poin per baris)
                  </label>
                  <textarea
                    id={`idea-points-${index}`}
                    className={inputClass}
                    rows={4}
                    value={idea.keyPoints?.join("\n") ?? ""}
                    onChange={(event) =>
                      updateContentIdea(
                        index,
                        "keyPoints",
                        event.target.value
                          .split(/\r?\n/)
                          .map((point) => point.trim())
                          .filter(Boolean)
                          .slice(0, 6)
                      )
                    }
                  />
                </div>

                <div className="mt-4">
                  <label className={labelClass} htmlFor={`idea-visual-${index}`}>
                    Arahan visual
                  </label>
                  <textarea
                    id={`idea-visual-${index}`}
                    className={inputClass}
                    rows={3}
                    maxLength={1000}
                    value={idea.visualDirection ?? ""}
                    onChange={(event) =>
                      updateContentIdea(index, "visualDirection", event.target.value)
                    }
                  />
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className={labelClass} htmlFor={`idea-caption-${index}`}>
                      Caption
                    </label>
                    <CopyTextButton text={idea.caption ?? ""} />
                  </div>
                  <textarea
                    id={`idea-caption-${index}`}
                    className={inputClass}
                    rows={5}
                    maxLength={1600}
                    value={idea.caption ?? ""}
                    onChange={(event) =>
                      updateContentIdea(index, "caption", event.target.value)
                    }
                  />
                </div>

                <div className="mt-4">
                  <label className={labelClass} htmlFor={`idea-cta-${index}`}>
                    CTA konten
                  </label>
                  <textarea
                    id={`idea-cta-${index}`}
                    className={inputClass}
                    rows={2}
                    maxLength={500}
                    value={idea.callToAction ?? ""}
                    onChange={(event) =>
                      updateContentIdea(index, "callToAction", event.target.value)
                    }
                  />
                </div>
              </div>
            </article>
          ))}

          {result.contentIdeas.length === 0 && (
            <p className="rounded-lg border border-dashed border-white/10 p-5 text-sm text-slate-400">
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
          className="rounded-lg bg-[#5232ff] px-6 py-3 text-sm font-semibold transition hover:bg-[#7258ff] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>

        <Link
          href={`/dashboard/campaigns/${campaignId}`}
          className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium transition hover:bg-slate-800"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
