"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useRef, useState, type ReactNode } from "react";
import LogoutButton from "./LogoutButton";
import { useDismiss } from "./useDismiss";

type IconName =
  | "home"
  | "campaigns"
  | "packs"
  | "studio"
  | "analytics"
  | "products"
  | "audience"
  | "brand"
  | "integrations"
  | "calendar";

const icons: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  campaigns: (
    <>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
    </>
  ),
  packs: (
    <>
      <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  studio: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="m4 16 4.5-4.5 4 4 3-3L20 17" />
      <circle cx="15.5" cy="9" r="1.2" />
    </>
  ),
  analytics: <path d="M4 20h16M7 17v-5M12 17V6M17 17v-8" />,
  products: (
    <>
      <path d="m4 8 8-4 8 4-8 4-8-4Z" />
      <path d="M4 8v8l8 4 8-4V8M12 12v8" />
    </>
  ),
  audience: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5" />
      <path d="M16 5.5a3 3 0 0 1 0 6M18.5 14.5c1.5.7 2.3 2.2 2.5 4.5" />
    </>
  ),
  brand: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="8.5" cy="11" r="1" />
      <circle cx="12" cy="8" r="1" />
      <circle cx="15.5" cy="11" r="1" />
      <path d="M9 16.5c1.8 1.2 4.2 1.2 6 0" />
    </>
  ),
  integrations: (
    <>
      <circle cx="7" cy="7" r="2.6" />
      <circle cx="17" cy="7" r="2.6" />
      <circle cx="7" cy="17" r="2.6" />
      <circle cx="17" cy="17" r="2.6" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2.5" />
      <path d="M8 3.5v4M16 3.5v4M4 10h16" />
    </>
  ),
};

function NavIcon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[21px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

export function SparkleLogo({ className = "size-9" }: { className?: string }) {
  // Unique id per instance: a gradient defined inside a hidden SVG (e.g. the desktop sidebar on mobile) would not render elsewhere.
  const gradientId = `sparkle-${useId().replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#c9c2ff" />
          <stop offset="1" stopColor="#5b46ff" />
        </linearGradient>
      </defs>
      <path
        d="M16 3c.9 8.6 6.4 14.1 15 15-8.6.9-14.1 6.4-15 15-.9-8.6-6.4-14.1-15-15 8.6-.9 14.1-6.4 15-15Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M31 22c.4 4.2 2.8 6.6 7 7-4.2.4-6.6 2.8-7 7-.4-4.2-2.8-6.6-7-7 4.2-.4 6.6-2.8 7-7Z"
        fill={`url(#${gradientId})`}
        opacity=".9"
      />
    </svg>
  );
}

type NavItem = { label: string; icon: IconName; href?: string; exact?: boolean };

// Items without an href have no page yet: they look the same as the design but do not navigate.
const navigation: NavItem[] = [
  { label: "Home", icon: "home", href: "/dashboard", exact: true },
  { label: "Campaigns", icon: "campaigns", href: "/dashboard/campaigns" },
  { label: "Ad Packs", icon: "packs" },
  { label: "Creative Studio", icon: "studio", href: "/dashboard/campaigns/generate" },
  { label: "Analytics", icon: "analytics" },
  { label: "Products", icon: "products" },
  { label: "Audience", icon: "audience" },
  { label: "Brand Kit", icon: "brand" },
  { label: "Integrations", icon: "integrations" },
  { label: "Content Calendar", icon: "calendar", href: "/dashboard/calendar" },
];

function isActivePath(href: string, pathname: string, exact = false) {
  if (exact) return pathname === href;
  if (href === "/dashboard/campaigns" && pathname.startsWith("/dashboard/campaigns/generate")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const activeClass =
  "border border-[#5646ff]/45 bg-gradient-to-r from-[#3a2fd6] via-[#2f26b0] to-[#241c80] text-white shadow-[0_0_28px_rgba(70,50,255,.28)]";
const idleClass = "border border-transparent text-slate-300 hover:bg-white/[0.04] hover:text-white";

export default function DashboardNavigation({
  email,
  generationsUsed = 0,
  generationsLimit = 10000,
}: {
  email: string;
  generationsUsed?: number;
  generationsLimit?: number;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useDismiss(menuOpen, menuRef, () => setMenuOpen(false));

  const name = email.split("@")[0] || "Akun";
  const percent = Math.min(100, Math.round((generationsUsed / generationsLimit) * 100));

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[256px] shrink-0 flex-col border-r border-white/[0.07] bg-[#080815]/90 px-3.5 pb-5 pt-6 backdrop-blur lg:flex">
        <Link href="/dashboard" aria-label="Go to home" className="flex items-center px-3">
          <SparkleLogo className="size-9" />
        </Link>

        <nav className="mt-7 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin]" aria-label="Main navigation">
          {navigation.map((item) => {
            const active = item.href ? isActivePath(item.href, pathname, item.exact) : false;
            const base = `flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-[15px] font-normal transition [@media(max-height:760px)]:py-2 ${active ? activeClass : idleClass}`;

            return item.href ? (
              <Link key={item.label} href={item.href} aria-current={active ? "page" : undefined} className={base}>
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            ) : (
              <span key={item.label} aria-disabled="true" className={`${base} cursor-default opacity-70`}>
                <NavIcon name={item.icon} />
                {item.label}
                <span className="ml-auto rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-300">Soon</span>
              </span>
            );
          })}
        </nav>

        <div className="mt-4 space-y-3">
          <div ref={menuRef} className="relative">
            {menuOpen && (
              <div className="absolute inset-x-0 bottom-full mb-2 rounded-xl border border-white/10 bg-[#0e0d1f] p-3 shadow-2xl">
                <p className="truncate text-xs text-slate-300">{email}</p>
                <div className="mt-3 border-t border-white/[0.07] pt-3">
                  <LogoutButton />
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-left transition hover:bg-white/[0.06]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-[#6c5bff]/50 bg-[#3a2fd6]/60 text-base font-medium text-white">
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-100">{name}</span>
                <span className="block text-xs text-slate-500">Personal workspace</span>
              </span>
              <svg viewBox="0 0 24 24" className="size-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 [@media(max-height:760px)]:p-3">
            <p className="text-xs text-slate-400">AI Generations</p>
            <p className="mt-2 text-xl font-semibold text-white">
              {generationsUsed.toLocaleString("en-US")}{" "}
              <span className="text-sm font-normal text-slate-400">/ {generationsLimit.toLocaleString("en-US")}</span>
            </p>
            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={generationsLimit}
              aria-valuenow={generationsUsed}
              aria-label="AI Generations usage"
            >
              <div className="h-full rounded-full bg-gradient-to-r from-[#4a3df0] to-[#6c5bff]" style={{ width: `${percent}%` }} />
            </div>
            <p className="mt-2.5 text-xs text-slate-400">{percent}% used</p>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#080815]/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" aria-label="Go to home" className="flex items-center">
            <SparkleLogo className="size-7" />
          </Link>
          <LogoutButton compact />
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto pb-0.5" aria-label="Main navigation">
          {navigation
            .filter((item) => item.href)
            .map((item) => {
              const active = isActivePath(item.href as string, pathname, item.exact);
              return (
                <Link
                  key={item.label}
                  href={item.href as string}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${active ? "bg-[#3a2fd6]/40 text-white" : "text-slate-400 hover:bg-white/5"}`}
                >
                  {item.label}
                </Link>
              );
            })}
        </nav>
      </header>
    </>
  );
}