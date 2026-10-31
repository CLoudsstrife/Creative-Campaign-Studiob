
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCampaign } from "./actions";

type Props = {
  campaignId: string;
  compact?: boolean;
};

export default function DeleteCampaignButton({
  campaignId,
  compact = false,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  function handleDelete() {
    setMessage("");

    startTransition(async () => {
      const result = await deleteCampaign(campaignId);

      if (result.error) {
        setMessage(result.error);
        setShowConfirm(false);
        return;
      }

      setMessage(result.success ?? "Campaign berhasil dihapus.");
      setShowConfirm(false);
      router.refresh();
    });
  }

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => {
            setMessage("");
            setShowConfirm(true);
          }}
          disabled={isPending}
          className={`${
            compact ? "px-3 text-xs" : "px-4 text-sm"
          } rounded-lg border border-red-500/30 py-2 font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50`}
        >
          {isPending
            ? "Menghapus..."
            : compact
              ? "Hapus"
              : "Hapus Campaign"}
        </button>

        {message && (
          <p
            aria-live="polite"
            className="mt-2 text-xs text-slate-300"
          >
            {message}
          </p>
        )}
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isPending) {
              setShowConfirm(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-campaign-title"
            aria-describedby="delete-campaign-description"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4m0 4h.01M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-13.1a2 2 0 0 0-3.4 0Z"
                />
              </svg>
            </div>

            <h2
              id="delete-campaign-title"
              className="text-lg font-semibold text-white"
            >
              Hapus Campaign?
            </h2>

            <p
              id="delete-campaign-description"
              className="mt-2 text-sm leading-relaxed text-slate-400"
            >
              Apakah kamu yakin ingin menghapus campaign ini?
              Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
