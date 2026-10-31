"use client";

import { useRef, useState } from "react";
import LogoutButton from "./LogoutButton";
import { useDismiss } from "./useDismiss";

export default function DashboardTopBar({ email }: { email: string }) {
  const initials = (email.split("@")[0] || "NT").slice(0, 2).toUpperCase();
  const [open, setOpen] = useState<"bell" | "account" | null>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useDismiss(open === "bell", bellRef, () => setOpen(null));
  useDismiss(open === "account", accountRef, () => setOpen(null));

  return (
    <div className="flex h-[76px] items-center justify-end gap-4 px-6 lg:h-[100px] lg:pr-7">
      <div ref={bellRef} className="relative">
        <button
          type="button"
          aria-label="Notifications"
          aria-haspopup="true"
          aria-expanded={open === "bell"}
          onClick={() => setOpen(open === "bell" ? null : "bell")}
          className="grid size-10 place-items-center rounded-full text-slate-200 transition hover:bg-white/[0.06]"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15L6 16.5Z" />
            <path d="M10 20.5a2 2 0 0 0 4 0" />
          </svg>
        </button>

        {open === "bell" && (
          <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-xl border border-white/10 bg-[#0e0d1f] p-4 shadow-2xl">
            <p className="text-sm font-medium text-white">Notifications</p>
            <div className="mt-4 rounded-lg border border-dashed border-white/10 px-4 py-8 text-center">
              <p className="text-sm text-slate-200">You&apos;re all caught up</p>
              <p className="mt-1 text-xs text-slate-500">New activity will show up here.</p>
            </div>
          </div>
        )}
      </div>

      <div ref={accountRef} className="relative">
        <button
          type="button"
          aria-label="Account menu"
          aria-haspopup="true"
          aria-expanded={open === "account"}
          onClick={() => setOpen(open === "account" ? null : "account")}
          className="relative grid size-[50px] place-items-center rounded-full border border-white/25 bg-[#0d0c1f] text-base font-medium text-white transition hover:border-white/40"
        >
          {initials}
          <span className="absolute bottom-0.5 right-0 size-3 rounded-full border-2 border-[#070712] bg-emerald-500" aria-hidden="true" />
        </button>

        {open === "account" && (
          <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-white/10 bg-[#0e0d1f] p-4 shadow-2xl">
            <p className="truncate text-sm font-medium text-white">{email}</p>
            <p className="mt-0.5 text-xs text-slate-500">Personal workspace</p>
            <div className="mt-3 border-t border-white/[0.07] pt-3">
              <LogoutButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}