# Landing page redesign

- Redesign · full · `/` (`src/app/page.tsx`)
- Before · static scan: 31 FAIL, 2 REFLEX, 10 WARN. Browser capture could not run because `puppeteer-core` is unavailable.
- Keeps · `/login` and `/register` routes, `campaignPhotos` data, each Unsplash attribution URL, campaign format concepts, BISIK preset references, and Plan/Develop/Manage workflow.
- Files · edit `src/app/page.tsx`, `src/app/globals.css`; create `src/app/icon.svg`; remove the default `src/app/favicon.ico` per the requested replacement.
- Theme · Vantage (2/3), for its dark product-led frame; swap its lime accent and typography for the existing cobalt tokens and project fonts.
- Shape · two-column product workbench hero, campaign preview, three product capabilities, a ruled workflow row, and the existing footer.
- Copy · shortened hero statement and format descriptions; BISIK context, four campaign formats, photo credits, and workflow meanings remain.
- Motion · uses existing `.dashboard-interactive` cubic-bezier and reduced-motion styles.

## Verification

- TypeScript: `npx tsc --noEmit` passed.
- ESLint: `npx eslint src/app/page.tsx` passed.
- Prisma Client generation: passed as the first step of `npm run build`.
- Build: stopped because Next.js could not fetch the existing Google Fonts in this network-restricted environment.
- Browser render at 1440px and 375px did not run because the Hallmark renderer reported no `puppeteer-core`; the existing local Next dev lock is held by another process.
- Static kept-check: clean, with all 4 recorded links retained.
- The initial baseline and final static scan are `.hallmark/before.txt` and `.hallmark/after.txt`. Dashboard baseline files from the previous redesign are preserved as `.hallmark/dashboard-overview-before.*` and `.hallmark/dashboard-overview-after.txt`.
