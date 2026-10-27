
"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

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

  function handleDownload() {
    setDownloading(true);

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

          const ideaTitle = `${index + 1}. ${idea.title} (${idea.format})`;
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
          y += 2;
        });

        addHeading("Call to Action");
        addParagraph(ai.callToAction);

        if (ai.input) {
          addHeading("Input AI");
          addField("Produk", ai.input.product);
          addField("Target Audiens", ai.input.targetAudience);
          addField("Platform", ai.input.platform);
          addField("Tone", ai.input.tone);
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
      window.alert("PDF gagal dibuat. Silakan coba kembali.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={downloading}
      className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {downloading ? "Menyiapkan PDF..." : "Download PDF"}
    </button>
  );
}
