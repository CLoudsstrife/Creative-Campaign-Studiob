
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCampaign } from "./actions";

type Props = {
  campaignId: string;
};

export default function DeleteCampaignButton({ campaignId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  function handleDelete() {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus campaign ini?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    startTransition(async () => {
      const result = await deleteCampaign(campaignId);

      if (result.error) {
        setMessage(result.error);
        return;
      }

      setMessage(result.success ?? "Campaign berhasil dihapus.");
      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
      >
        {isPending ? "Menghapus..." : "Hapus Campaign"}
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
  );
}
