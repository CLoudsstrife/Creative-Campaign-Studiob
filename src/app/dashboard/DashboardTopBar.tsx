"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { useDismiss } from "./useDismiss";

export default function DashboardTopBar({ email }: { email: string }) {
  const pathname = usePathname();
  const initials = (email.split("@")[0] || "NT").slice(0, 2).toUpperCase();
  const [open, setOpen] = useState<"bell" | "account" | null>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useDismiss(open === "bell", bellRef, () => setOpen(null));
  useDismiss(open === "account", accountRef, () => setOpen(null));

  const pageTitle = pathname.startsWith("/dashboard/campaigns/generate")
    ? "Creative Studio"
    : pathname.startsWith("/dashboard/campaigns/new")
      ? "New campaign"
      : pathname.startsWith("/dashboard/campaigns/")
        ? "Campaign workspace"
        : pathname.startsWith("/dashboard/campaigns")
          ? "Campaigns"
          : pathname.startsWith("/dashboard/calendar")
            ? "Content calendar"
            : "Overview";

  return (
    <div className="flex h-[68px] items-center justify-between gap-4 border-b border-edge px-5 sm:px-7 lg:h-[76px] lg:px-10">
      <div className="min-w-0">
        <p className="text-xs text-ink-subtle">CreativeFlow workspace</p>
        <p className="mt-1 truncate text-sm font-medium text-foreground">{pageTitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div ref={bellRef} className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-haspopup="true"
            aria-expanded={open === "bell"}
            onClick={() => setOpen(open === "bell" ? null : "bell")}
            className="dashboard-interactive grid size-10 place-items-center rounded-md text-ink-muted hover:bg-white/[0.05] hover:text-foreground active:scale-[0.98] focus-visible:outline-offset-2"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 16.5V11a6 6 0 1 1 12 0v5.5l1.5 2h-15L6 16.5Z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></svg>
          </button>

          <div aria-hidden={open !== "bell"} inert={open !== "bell"} data-state={open === "bell" ? "open" : "closed"} className="dashboard-popover absolute right-0 top-full z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-edge bg-surface-raised p-4">
            <p className="text-sm font-medium text-foreground">Notifications</p>
            <div className="mt-4 rounded-md border border-edge px-4 py-7 text-center">
              <p className="text-sm text-foreground">You&apos;re all caught up</p>
              <p className="mt-1 text-xs text-ink-subtle">New activity will show up here.</p>
            </div>
          </div>
        </div>

        <div ref={accountRef} className="relative">
          <button
            type="button"
            aria-label="Account menu"
            aria-haspopup="true"
            aria-expanded={open === "account"}
            onClick={() => setOpen(open === "account" ? null : "account")}
            className="dashboard-interactive relative grid size-10 place-items-center rounded-md border border-edge bg-surface text-sm font-medium text-foreground hover:border-white/20 hover:bg-surface-raised active:scale-[0.98] focus-visible:outline-offset-2"
          >
            {initials}
            <span className="absolute bottom-0.5 right-0 size-2.5 rounded-full border-2 border-background bg-success" aria-hidden="true" />
          </button>

          <div aria-hidden={open !== "account"} inert={open !== "account"} data-state={open === "account" ? "open" : "closed"} className="dashboard-popover absolute right-0 top-full z-30 mt-2 w-64 rounded-lg border border-edge bg-surface-raised p-4">
            <p className="truncate text-sm font-medium text-foreground">{email}</p>
            <p className="mt-0.5 text-xs text-ink-subtle">Personal workspace</p>
            <div className="mt-3 border-t border-edge pt-3"><LogoutButton /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
