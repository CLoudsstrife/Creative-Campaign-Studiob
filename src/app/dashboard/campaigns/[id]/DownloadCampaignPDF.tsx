
"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

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
  workflowStatus?: "idea" | "draft" | "review" | "ready" | "published";
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

type CampaignPDFData = {
  title: string;
  description: string | null;
  brandName: string | null;
  targetAudience: string | null;
  platform: string | null;
  tone: string | null;
  status: string;
  updatedAt: string;
  aiResult: CampaignAIResult | null;
};

type Props = {
  campaign: CampaignPDFData;
};

export default function DownloadCampaignPDF({ campaign }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleDownload() {
    setDownloading(true);
    setErrorMessage("");

    try {
      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      function addPageIfNeeded(requiredHeight = 10) {
        if (y + requiredHeight > pageHeight - 18) {
          pdf.addPage();
          y = 20;
        }
      }

      function addHeading(text: string) {
        addPageIfNeeded(14);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.setTextColor(37, 99, 235);
        pdf.text(text, margin, y);
        y += 8;
      }

      function addParagraph(text: string) {
        const safeText = text.trim() || "-";
        const lines = pdf.splitTextToSize(safeText, contentWidth);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(55, 65, 81);

        for (const line of lines) {
          addPageIfNeeded(6);
          pdf.text(line, margin, y);
          y += 5;
        }

        y += 3;
      }

      function addField(label: string, value: string | null | undefined) {
        addPageIfNeeded(12);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(31, 41, 55);
        pdf.text(`${label}:`, margin, y);
        y += 5;
        addParagraph(value || "-");
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(30, 64, 175);

      const titleLines = pdf.splitTextToSize(
        campaign.aiResult?.campaignTitle || campaign.title,
        contentWidth
      );

      pdf.text(titleLines, margin, y);
      y += titleLines.length * 10 + 2;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text("CREATIVEFLOW AI | CAMPAIGN REPORT", margin, y);
      y += 10;

      pdf.setDrawColor(203, 213, 225);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 10;

      addHeading("Informasi Campaign");
      addField("Judul", campaign.title);
      addField("Brand", campaign.brandName);
      addField("Target Audiens", campaign.targetAudience);
      addField("Platform", campaign.platform);
      addField("Tone of Voice", campaign.tone);
      addField("Status", campaign.status);
      addField("Terakhir Diperbarui", campaign.updatedAt);
      addField("Deskripsi", campaign.description);

      if (campaign.aiResult) {
        const ai = campaign.aiResult;

        addHeading("AI Generated Campaign");
        addField("Big Idea", ai.bigIdea);
        addField("Campaign Objective", ai.objective);
        addField("Key Message", ai.keyMessage);

        addHeading("Content Ideas");

        if (ai.contentIdeas.length === 0) {
          addParagraph("Belum ada content ideas.");
        }

        ai.contentIdeas.forEach((idea, index) => {
          addPageIfNeeded(24);

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(11);
          pdf.setTextColor(31, 41, 55);

          const selected =
            campaign.aiResult?.selectedIdeaIndex === index
              ? " · IDE PILIHAN"
              : "";

          const ideaTitle = `${index + 1}. ${idea.title} (${idea.format})${selected}`;
          const ideaTitleLines = pdf.splitTextToSize(
            ideaTitle,
            contentWidth
          );

          for (const line of ideaTitleLines) {
            addPageIfNeeded(6);
            pdf.text(line, margin, y);
            y += 5;
          }

          y += 1;
          addParagraph(idea.description);
          addField("Status produksi", idea.workflowStatus || "idea");

          if (idea.scheduledAt) {
            addField(
              "Jadwal publikasi",
              new Intl.DateTimeFormat("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(idea.scheduledAt))
            );
          }

          if (idea.hook) addField("Hook", idea.hook);
          if (idea.concept) addField("Angle dan konsep", idea.concept);

          idea.keyPoints?.forEach((point, pointIndex) =>
            addField(`Alur ${pointIndex + 1}`, point)
          );

          if (idea.visualDirection) {
            addField("Arahan visual", idea.visualDirection);
          }

          if (idea.caption) addField("Draft caption", idea.caption);
          if (idea.callToAction) {
            addField("CTA konten", idea.callToAction);
          }

          y += 2;
        });

        addHeading("Call to Action");
        addParagraph(ai.callToAction);

        if (ai.claimsToVerify?.length) {
          addHeading("Klaim yang Perlu Dicek");
          ai.claimsToVerify.forEach((claim, index) =>
            addField(`Klaim ${index + 1}`, claim)
          );
        }

        if (ai.sources?.length) {
          addHeading("Sumber Web untuk Ditinjau");
          ai.sources.forEach((source, index) => {
            addField(`Sumber ${index + 1}`, `${source.title}\n${source.url}`);
          });
        }

        if (ai.input) {
          addHeading("Input AI");
          addField("Produk", ai.input.product);
          addField("Target Audiens", ai.input.targetAudience);
          addField("Platform", ai.input.platform);
          addField("Tone", ai.input.tone);
          addField("Konteks brand", ai.input.brandContext);
          addField("Pilar konten", ai.input.contentPillars);
          addField("Pedoman editorial", ai.input.editorialRules);
        }
      }

      const pageCount = pdf.getNumberOfPages();

      for (let page = 1; page <= pageCount; page++) {
        pdf.setPage(page);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text(
          `CreativeFlow AI | Halaman ${page} dari ${pageCount}`,
          pageWidth / 2,
          pageHeight - 8,
          { align: "center" }
        );
      }

      const filename = campaign.title
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .slice(0, 80) || "campaign";

      pdf.save(`${filename}.pdf`);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      setErrorMessage("PDF gagal dibuat. Silakan coba kembali.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {downloading ? "Menyiapkan PDF..." : "Download PDF"}
      </button>

      {errorMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="pdf-error-title"
          aria-describedby="pdf-error-description"
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.29 3.86l-8.1 14.02A2 2 0 003.92 21h16.16a2 2 0 001.73-3.12l-8.1-14.02a2 2 0 00-3.46 0z"
                />
              </svg>
            </div>

            <h2
              id="pdf-error-title"
              className="text-lg font-semibold text-white"
            >
              Gagal Membuat PDF
            </h2>

            <p
              id="pdf-error-description"
              className="mt-2 text-sm leading-relaxed text-slate-400"
            >
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
