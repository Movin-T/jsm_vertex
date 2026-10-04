# Unify site header

## Goal

Extract one shared `SiteHeader` component and use it on all three pages
(`/`, `/courses`, `/courses/[slug]`) so the header no longer drifts between
pages that were each pixel-matched to different screenshots.

## Code inspected

- `web/app/page.tsx` — header uses `max-w-[1440px]`, brand text `18px`, nav
  `gap-8 text-[12px]`, auth buttons `px-3.5 py-1.5`.
- `web/app/courses/page.tsx` — duplicates the same 1440px header verbatim.
- `web/app/courses/[slug]/page.tsx` — header uses `max-w-[1180px]`, brand
  text `19px`, nav `gap-5 sm:gap-9 text-[13px]`, slightly different auth
  button spacing. Also has local `BrandMark`/`Icon` copies.

## Decision

- Canonical style = the homepage/`/courses` header (1440px container, 12px
  nav), since it's already shared by two pages; update the course detail
  page's header to match it instead.
- Create `web/components/site-header.tsx` (new `components/` dir — first
  shared UI piece) exporting `SiteHeader` and the `BrandMark`/bell `Icon`
  pieces it needs internally (kept private to the file, not exported,
  since no other page needs them yet).
- Each page keeps passing nothing (header is fully static/self-contained;
  it already gets auth state from Clerk context, not props).
- Remove the now-duplicated `BrandMark`/header-only `Icon` cases from each
  page file; keep `Icon` cases that pages still use elsewhere (e.g.
  `chart`/`clock`/`book`/`arrow`/`search` stay local since they're used in
  cards/hero, not the header).

## Expected files

- `web/components/site-header.tsx` — new.
- `web/app/page.tsx`, `web/app/courses/page.tsx`,
  `web/app/courses/[slug]/page.tsx` — replace inline `<header>` markup with
  `<SiteHeader />`; remove now-unused local `BrandMark` and header-only
  `bell` icon case if nothing else in the file needs it.

## Acceptance criteria

- All three pages render an identical header (visually and in markup).
- `npm run lint`, `tsc --noEmit`, `npm run build` pass.

## Manual test steps

1. Compare header on `/`, `/courses`, and a course detail page — same width,
   spacing, and font sizes.
2. Click through nav links on each page; confirm no regressions.
