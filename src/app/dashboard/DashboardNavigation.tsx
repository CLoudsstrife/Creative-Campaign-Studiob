"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

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
  home: <><path d="M3.5 10.5 12 3.5l8.5 7" /><path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" /></>,
  campaigns: <><path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>,
  packs: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
  studio: <><rect x="3.5" y="4" width="17" height="16" rx="2.5" /><path d="m4 16 4.5-4.5 4 4 3-3L20 17" /><circle cx="15.5" cy="9" r="1.2" /></>,
  analytics: <path d="M4 20h16M7 17v-5M12 17V6M17 17v-8" />,
  products: <><path d="m4 8 8-4 8 4-8 4-8-4Z" /><path d="M4 8v8l8 4 8-4V8M12 12v8" /></>,
  audience: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5M16 5.5a3 3 0 0 1 0 6M18.5 14.5c1.5.7 2.3 2.2 2.5 4.5" /></>,
  brand: <><circle cx="12" cy="12" r="8.5" /><circle cx="8.5" cy="11" r="1" /><circle cx="12" cy="8" r="1" /><circle cx="15.5" cy="11" r="1" /><path d="M9 16.5c1.8 1.2 4.2 1.2 6 0" /></>,
  integrations: <><circle cx="7" cy="7" r="2.6" /><circle cx="17" cy="7" r="2.6" /><circle cx="7" cy="17" r="2.6" /><circle cx="17" cy="17" r="2.6" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path d="M8 3.5v4M16 3.5v4M4 10h16" /></>,
};

function NavIcon({ name }: { name: IconName }) {
  return <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

export function SparkleLogo({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5.75" y="5.75" width="28.5" height="28.5" rx="8" />
      <path d="M14 14h12v12H14zM20 14v12M14 20h12" />
    </svg>
  );
}

type NavItem = { label: string; icon: IconName; href?: string; exact?: boolean };

// Items without an href have no page yet and remain visibly unavailable.
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

export default function DashboardNavigation({
  generationsUsed,
  generationsLimit,
}: {
  generationsUsed: number;
  generationsLimit: number;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const percent = Math.min(100, Math.round((generationsUsed / generationsLimit) * 100));

  return (
    <>
      <aside data-collapsed={collapsed} className="js dashboard-sidebar sticky top-0 hidden h-screen shrink-0 flex-col border-r border-edge bg-surface pb-5 pt-5 lg:flex">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between gap-2 px-2"}`}>
          <Link href="/dashboard" aria-label="CreativeFlow home" title="CreativeFlow" className={`relative flex min-w-0 items-center gap-2.5 text-accent ${collapsed ? "justify-center" : ""}`}>
            <SparkleLogo className="size-9 shrink-0" />
            <span className="dashboard-brand-label truncate text-sm font-semibold tracking-tight text-foreground">creative-flow</span>
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="dashboard-interactive grid size-8 shrink-0 place-items-center rounded-lg border border-edge text-ink-muted hover:border-accent/30 hover:bg-accent-soft hover:text-foreground active:scale-[0.98] focus-visible:outline-offset-2"
          >
            <svg viewBox="0 0 24 24" className={`size-4 transition-transform duration-300 motion-reduce:transition-none [transition-timing-function:var(--ease-out-cubic)] ${collapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 5 7.5 12l7 7M19 5v14" /></svg>
          </button>
        </div>

        <nav className={`mt-7 min-h-0 flex-1 space-y-1 overflow-y-auto [scrollbar-width:thin] ${collapsed ? "px-0.5" : "pr-1"}`} aria-label="Main navigation">
          {navigation.map((item) => {
            const active = item.href ? isActivePath(item.href, pathname, item.exact) : false;
            const base = `dashboard-interactive relative flex items-center rounded-lg py-2.5 text-sm font-medium [@media(max-height:760px)]:py-2 ${collapsed ? "justify-center px-0" : "gap-3 px-3"} ${active ? "border border-accent/25 bg-accent-soft text-foreground" : "border border-transparent text-ink-muted hover:bg-white/[0.04] hover:text-foreground"}`;
            const label = <span className="dashboard-nav-label truncate">{item.label}</span>;

            return item.href ? (
              <Link key={item.label} href={item.href} title={collapsed ? item.label : undefined} aria-current={active ? "page" : undefined} className={base}>
                <NavIcon name={item.icon} />{label}
              </Link>
            ) : (
              <span key={item.label} title={collapsed ? `${item.label}, coming soon` : undefined} aria-disabled="true" className={`${base} cursor-default opacity-55`}>
                <NavIcon name={item.icon} />{label}
                <span className="ml-auto rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-ink-subtle">Soon</span>
              </span>
            );
          })}
        </nav>

        <div title={`${generationsUsed.toLocaleString("en-US")} of ${generationsLimit.toLocaleString("en-US")} AI generations used`} className={`mt-4 rounded-lg border border-edge bg-surface-raised [@media(max-height:760px)]:p-3 ${collapsed ? "p-2.5" : "p-4"}`}>
          <div className="dashboard-usage-details flex items-center justify-between gap-2 text-xs text-ink-muted">
            <span>AI Generations</span>
            <span className="tabular-nums">{generationsUsed.toLocaleString("en-US")} / {generationsLimit.toLocaleString("en-US")}</span>
          </div>
          <p className={`font-semibold text-foreground tabular-nums ${collapsed ? "text-center text-xs" : "mt-2 text-xl"}`}>
            {collapsed ? generationsUsed.toLocaleString("en-US") : `${percent}%`}
            {!collapsed && <span className="ml-1 text-sm font-normal text-ink-subtle">used</span>}
          </p>
          <div className={`${collapsed ? "mt-2" : "mt-3"} h-1.5 overflow-hidden rounded-full bg-white/10`} role="progressbar" aria-valuemin={0} aria-valuemax={generationsLimit} aria-valuenow={generationsUsed} aria-label="AI Generations usage">
            <div className="h-full rounded-full bg-accent" style={{ width: `${percent}%` }} />
          </div>
          {!collapsed && <p className="dashboard-usage-details mt-2.5 text-xs text-ink-subtle">Cumulative app usage</p>}
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-edge bg-background px-4 py-3 lg:hidden">
        <div className="flex items-center">
          <Link href="/dashboard" aria-label="Go to home" className="text-accent"><SparkleLogo className="size-7" /></Link>
        </div>
        <nav className="mt-3 flex gap-1 overflow-x-auto pb-0.5" aria-label="Main navigation">
          {navigation.filter((item) => item.href).map((item) => {
            const href = item.href as string;
            const active = isActivePath(href, pathname, item.exact);
            return <Link key={item.label} href={item.href as string} aria-current={active ? "page" : undefined} className={`dashboard-interactive shrink-0 rounded-md px-3 py-2 text-xs font-medium active:scale-[0.98] ${active ? "bg-accent-soft text-foreground" : "text-ink-muted hover:bg-white/5 hover:text-foreground"}`}>{item.label}</Link>;
          })}
        </nav>
      </header>
    </>
  );
}
