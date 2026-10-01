# All Courses page

## Goal

Add a dedicated `/courses` page that lists every seeded course, and wire the
homepage's "Courses" nav link, hero "Explore Courses" button, and "View all
courses" link to it (replacing the `#courses` anchor).

## Skills read

- sanity-best-practices (GROQ/data-fetching conventions, already applied).
- next-best-practices (App Router page conventions).

## Code inspected

- `web/app/page.tsx` — homepage header, hero, course grid, `CourseCard`/
  `CourseMark`/`Icon`/`BrandMark` helpers (fetches via `getCourses()`).
- `web/app/courses/[slug]/page.tsx` — confirms the established convention of
  duplicating `BrandMark`/`Icon`/header markup per top-level page rather than
  a shared layout/component (no `components/` directory exists yet).
- `web/sanity/lib/data.ts` — `getCourses()` already returns all courses
  sorted by title, with level/duration/module fields.

## Decisions & assumptions

- Keep it simple: no filters, search, or pagination — just a full grid of
  all seeded courses, reusing the same card styling as the homepage.
- Follow the existing per-page duplication convention (header, `BrandMark`,
  `Icon`, `CourseCard`, `CourseMark`) rather than introducing a shared
  `components/` module — consistent with how `courses/[slug]/page.tsx` was
  built, and avoids a larger refactor.
- Page shows a simple header (same nav/auth as homepage) + a heading ("All
  Courses") with a result count, then the same 3-column responsive grid.
- Homepage changes (minimal, wiring only):
  - Nav "Courses" link → `/courses`.
  - Hero "Explore Courses" button → `/courses`.
  - "View all courses" link in the All Courses section → `/courses`.
  - Leave the homepage's own course grid/preview as-is (still shows all 10
    courses today — no change to that section's content).

## Expected files

- `web/app/courses/page.tsx` — new, async server component.
- `web/app/page.tsx` — update three link targets only.

## Requirements

- Server-side data fetching only (`getCourses()`), no client Sanity calls.
- Responsive grid matches homepage (3-col desktop, stacks on mobile).
- Cards link to `/courses/[slug]`.

## Security considerations

- No new data exposure; same public course fields already used on the
  homepage.

## Acceptance criteria

- `/courses` renders all seeded courses with correct title/level/duration/
  module count, each linking to its detail page.
- Homepage's nav, hero button, and "View all courses" link navigate to
  `/courses`.
- `npm run lint`, `tsc --noEmit`, `npm run build` pass in `web/`.

## Checks

- `web/`: `npm run lint`, `tsc --noEmit`, `npm run build`.

## Manual test steps

1. From `/`, click "View all courses" (or the nav "Courses" link) → lands on
   `/courses` showing all courses.
2. Click a card → navigates to its `/courses/[slug]` detail page.
3. Check mobile viewport (~390px) for no overflow.
