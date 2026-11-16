# Dashboard redesign plan

- Redesign · full · authenticated dashboard overview and shared shell
- Before · initial static app scan: 107 FAIL, 10 REFLEX; browser screenshots were unavailable before edits
- Keeps · Supabase auth and redirect, Prisma metrics/recent-campaign queries, generation count and limit props, all routes, useDismiss behavior, sign-out logic
- Files · edit `src/app/dashboard/layout.tsx`, `src/app/dashboard/page.tsx`, `src/app/dashboard/DashboardNavigation.tsx`, `src/app/dashboard/DashboardTopBar.tsx`, `src/app/dashboard/LogoutButton.tsx`, `src/app/globals.css`; create no runtime files
- Drops · duplicate sidebar account toggle and its open-state handler; account and logout remain in the top-bar menu
- Theme · zinc surfaces, thin edges, restrained cobalt, Manrope/Sora/Geist Mono
- Composition · compact workspace header, metrics strip, utility links, dense recent campaign list
- Motion · requested sidebar expansion/collapse uses flex-basis transition; popovers use opacity/transform/visibility transitions; reduced motion is respected
- Copy · shortened dashboard helper copy; retained displayed metric labels, empty state meaning, statuses, and account copy
- Routes · `/dashboard`, `/dashboard/campaigns`, `/dashboard/campaigns/generate`, `/dashboard/campaigns/new`, `/dashboard/calendar`, and campaign detail links are retained

## Verification

- ESLint: completed with one pre-existing warning in `src/app/dashboard/calendar/CalendarGrid.tsx`.
- TypeScript: `npx tsc --noEmit` passed.
- Build: blocked because Next.js could not fetch the existing Google-hosted Manrope, Sora, and Geist Mono fonts in this network-restricted environment.
- Browser render: the requested 1440px and 375px render check could not run because the Hallmark renderer has no installed `puppeteer-core`; no reliable desktop/mobile screenshots were captured. A local Next dev lock is also held by another process. The local browser automation helper stopped because it could not confirm the current browser URL.
- Static kept-check: 15/15 links and 6/6 fields retained. One handler was removed by design: the duplicate sidebar account toggle, with logout retained in the top-bar menu.
- Static after-check is in `.hallmark/after.txt`; the render attempt reported that `puppeteer-core` is unavailable.
