
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { campaignPhotos } from "@/lib/campaign-visuals";

type Campaign = {
  id: string;
  title: string;
  description: string | null;
  brandName: string | null;
  targetAudience: string | null;
  platform: string | null;
  tone: string | null;
  status: string;
  aiResult: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Props = {
  campaigns: Campaign[];
};

export default function CampaignFilters({ campaigns }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [aiFilter, setAiFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const platforms = useMemo(
    () =>
      Array.from(
        new Set(
          campaigns
            .map((campaign) => campaign.platform?.trim())
            .filter((platform): platform is string => Boolean(platform))
        )
      ).sort((a, b) => a.localeCompare(b)),
    [campaigns]
  );

  const filteredCampaigns = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = campaigns.filter((campaign) => {
      const matchesSearch =
        !keyword ||
        [
          campaign.title,
          campaign.description,
          campaign.brandName,
          campaign.targetAudience,
          campaign.platform,
          campaign.tone,
        ].some((value) => value?.toLowerCase().includes(keyword));

      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;

      const matchesPlatform =
        platformFilter === "all" ||
        campaign.platform === platformFilter;

      const matchesAI =
        aiFilter === "all" ||
        (aiFilter === "ai" && Boolean(campaign.aiResult)) ||
        (aiFilter === "manual" && !campaign.aiResult);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPlatform &&
        matchesAI
      );
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.updatedAt.getTime() - b.updatedAt.getTime();

        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "newest":
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime();
      }
    });

    return result;
  }, [campaigns, search, statusFilter, platformFilter, aiFilter, sortBy]);

  const statuses = useMemo(
    () =>
      Array.from(new Set(campaigns.map((campaign) => campaign.status))).sort(),
    [campaigns]
  );

  function resetFilters() {
    setSearch("");
    setStatusFilter("all");
    setPlatformFilter("all");
    setAiFilter("all");
    setSortBy("newest");
  }

  return (
    <>
      <section className="mb-6 rounded-2xl border border-white/[0.08] bg-[#111019] p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-3">
            <label
              htmlFor="campaign-search"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Cari Campaign
            </label>

            <input
              id="campaign-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul, brand, target audiens, platform..."
              className="w-full rounded-lg border border-white/10 bg-[#0b0a11] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
            />
          </div>

          <div>
            <label
              htmlFor="status-filter"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0b0a11] px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
            >
              <option value="all">Semua Status</option>

              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="platform-filter"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Platform
            </label>

            <select
              id="platform-filter"
              value={platformFilter}
              onChange={(event) => setPlatformFilter(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0b0a11] px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
            >
              <option value="all">Semua Platform</option>

              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="ai-filter"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Sumber Campaign
            </label>

            <select
              id="ai-filter"
              value={aiFilter}
              onChange={(event) => setAiFilter(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#0b0a11] px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
            >
              <option value="all">Semua Campaign</option>
              <option value="ai">AI-Generated</option>
              <option value="manual">Tanpa Hasil AI</option>
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label
              htmlFor="sort-filter"
              className="mb-2 block text-sm font-medium text-slate-300"
            >
              Urutkan
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0b0a11] px-3 py-3 text-sm text-white outline-none focus:border-violet-500"
              >
                <option value="newest">Terbaru diperbarui</option>
                <option value="oldest">Terlama diperbarui</option>
                <option value="title-asc">Judul A–Z</option>
                <option value="title-desc">Judul Z–A</option>
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg border border-white/10 px-4 py-3 text-sm font-medium transition hover:bg-slate-800"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Hasil Campaign</h2>

        <span className="text-sm text-slate-400">
          {filteredCampaigns.length} dari {campaigns.length} campaign
        </span>
      </div>

      {filteredCampaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#111019]/50 px-6 py-16 text-center">
          <h3 className="text-xl font-semibold">
            Campaign tidak ditemukan
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Coba ubah kata kunci atau filter yang kamu gunakan.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 rounded-lg bg-[#5232ff] px-5 py-3 font-medium transition hover:bg-[#7258ff]"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign, index) => (
            <article
              key={campaign.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111019] transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/25 hover:shadow-[0_18px_45px_rgba(71,45,255,.16)]"
            >
              <Link
                href={`/dashboard/campaigns/${campaign.id}`}
                aria-label={`Buka campaign ${campaign.title}`}
                style={{ backgroundImage: `linear-gradient(180deg,rgba(12,10,22,.05),rgba(12,10,22,.15) 35%,rgba(17,16,25,.96)),linear-gradient(135deg,rgba(124,58,237,.2),transparent 65%),url("${campaignPhotos[index % campaignPhotos.length].url}")` }}
                className="group/cover relative flex aspect-[4/5] min-h-[310px] flex-col justify-end border-b border-white/[0.06] bg-cover bg-center sm:min-h-[360px]"
              >
                <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/25 bg-black/30 text-lg text-white/85 opacity-0 shadow-lg backdrop-blur-md transition group-hover/cover:opacity-100 group-focus-visible/cover:opacity-100" aria-hidden="true">↗</span>
                <div className="p-5 sm:p-6">
                  <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-white drop-shadow-lg sm:text-2xl">{campaign.title}</h3>
                </div>
              </Link>
              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <a href={campaignPhotos[index % campaignPhotos.length].source} target="_blank" rel="noreferrer" className="truncate text-[10px] text-slate-500 underline decoration-white/20 underline-offset-2 hover:text-slate-300">
                  Foto: {campaignPhotos[index % campaignPhotos.length].credit} · Unsplash
                </a>
                <Link
                  href={`/dashboard/campaigns/${campaign.id}/edit`}
                  aria-label={`Edit ${campaign.title}`}
                  className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                >
                  Edit
                </Link>
                <DeleteCampaignButton campaignId={campaign.id} compact />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function DeleteCampaignButton({ campaignId, compact = false }: { campaignId: string; compact?: boolean }) {
  return <DeleteButtonWrapper campaignId={campaignId} compact={compact} />;
}

import DeleteButtonWrapper from "./DeleteCampaignButton";
