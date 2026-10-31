"use client";

import { useState } from "react";

type Props = {
  text: string;
  label?: string;
};

export default function CopyTextButton({
  text,
  label = "Salin caption",
}: Props) {
  const [message, setMessage] = useState("");

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setMessage("Tersalin");
    } catch {
      setMessage("Tidak bisa menyalin. Silakan salin teks secara manual.");
    }

    window.setTimeout(() => setMessage(""), 2500);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={copyText}
        disabled={!text.trim()}
        className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {label}
      </button>
      {message && (
        <span role="status" className="text-xs text-emerald-300">
          {message}
        </span>
      )}
    </span>
  );
}
