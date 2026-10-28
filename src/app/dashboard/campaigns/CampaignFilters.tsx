
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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
      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5">
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500"
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
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
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
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
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="newest">Terbaru diperbarui</option>
                <option value="oldest">Terlama diperbarui</option>
                <option value="title-asc">Judul A–Z</option>
                <option value="title-desc">Judul Z–A</option>
              </select>

              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg border border-slate-700 px-4 py-3 text-sm font-medium transition hover:bg-slate-800"
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
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
          <h3 className="text-xl font-semibold">
            Campaign tidak ditemukan
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Coba ubah kata kunci atau filter yang kamu gunakan.
          </p>

          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium transition hover:bg-blue-500"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <article
              key={campaign.id}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="break-words text-lg font-semibold">
                  {campaign.title}
                </h3>

                <span className="shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
                  {campaign.status}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 min-h-12 text-sm text-slate-400">
                {campaign.description || "Belum ada deskripsi."}
              </p>

              <div className="mt-5 space-y-2 text-sm">
                {campaign.brandName && (
                  <p className="text-slate-300">
                    <span className="text-slate-500">Brand:</span>{" "}
                    {campaign.brandName}
                  </p>
                )}

                {campaign.platform && (
                  <p className="text-slate-300">
                    <span className="text-slate-500">Platform:</span>{" "}
                    {campaign.platform}
                  </p>
                )}

                {campaign.targetAudience && (
                  <p className="text-slate-300">
                    <span className="text-slate-500">Target:</span>{" "}
                    {campaign.targetAudience}
                  </p>
                )}
              </div>

              {campaign.aiResult && (
                <span className="mt-4 w-fit rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                  AI-Generated
                </span>
              )}

              <p className="mt-5 text-xs text-slate-500">
                Diperbarui{" "}
                {new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "medium",
                }).format(campaign.updatedAt)}
              </p>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-800 pt-4">
                <Link
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium transition hover:bg-slate-800"
                >
                  View Details
                </Link>

                <Link
                  href={`/dashboard/campaigns/${campaign.id}/edit`}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
                >
                  Edit Campaign
                </Link>

                <DeleteCampaignButton campaignId={campaign.id} />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function DeleteCampaignButton({ campaignId }: { campaignId: string }) {
  return <DeleteButtonWrapper campaignId={campaignId} />;
}

import DeleteButtonWrapper from "./DeleteCampaignButton";
