# Homepage: fetch courses from seeded Sanity content

## Goal

Replace the homepage's hardcoded `courses` array (`web/app/page.tsx`) with real
courses fetched from Sanity, so the "All Courses" grid shows the actual seeded
catalog and each card links to its real `/courses/[slug]` detail page.

## Skills read

- sanity-best-practices (GROQ, TypeGen conventions) — reused patterns already
  established in the prior course-detail-page task.
- next-best-practices / web-design-guidelines — for server component data
  fetching and responsive grid conventions already in use on this page.

## Code inspected

- `web/app/page.tsx` — static `courses` array (3 entries), `CourseMark`
  (Docker svg special-case + text-initial fallback), `CourseCard` (currently
  links to `href="#courses"`), and the `All Courses` grid section.
- `web/sanity/lib/data.ts` — `getCourses()` already implemented, calls
  `COURSES_QUERY`, tagged `['course']`.
- `web/sanity/queries/course.ts` — `COURSES_QUERY` selects `_id, title, slug,
  summary, coverImage, level, price, popular, studentCount, instructor->,
  category->, moduleCount, lessonCount`. No duration field.
- `web/sanity/lib/duration.ts` — shared `durationInSeconds()` /
  `formatDuration()` helpers, already used by the course detail page to sum
  lesson durations into a total.
- `web/app/courses/[slug]/page.tsx` — reference pattern for summing lesson
  durations and rendering Sanity images via `urlFor()` + `next/image`.
- `studio/schemaTypes/documents/course.ts` — `level` is a lowercase enum
  (`beginner` / `intermediate` / `advanced`), needs capitalizing for display.
- `studio/scripts/seed/seed.ndjson` — 10 real seeded courses (e.g. "Next.js
  App Router in Depth", "React Performance Engineering", etc.), each with 4
  modules / 12 lessons, cover images from picsum.photos placeholders.

## Decisions & assumptions

- **Query change**: extend `COURSES_QUERY` with
  `"lessonDurations": modules[].lessons[]->duration` so the homepage can sum
  total course duration the same way the course detail page does. This
  requires regenerating `web/sanity.types.ts` via Sanity TypeGen (run from
  `studio/`).
- **Show all 10 seeded courses** in the existing 3-column responsive grid
  (it already wraps rows; no pagination/"view all" page exists yet per
  AGENTS.md scope, so "View all courses" stays a same-page anchor).
- **Course mark / logo**: drop the hardcoded Docker-SVG special case (no
  seeded course has a matching logo field). Render the real `coverImage` via
  `urlFor()` + `next/image` when present (small rounded thumbnail replacing
  the colored initials box); fall back to a text-initials mark derived from
  the course title (e.g. first letters of the first two words) only if no
  cover image exists.
- **Level display**: capitalize the enum value (`beginner` → `Beginner`).
- **Duration display**: sum lesson durations with `durationInSeconds` /
  `formatDuration`; if a course has no lessons/durations, omit the clock stat
  for that card rather than showing "0s".
- **Modules text**: use the already-fetched `moduleCount` (`"{n} modules"`).
- **Card link**: `Link href={`/courses/${course.slug.current}`}` instead of
  `#courses`, using the real course detail route built previously.
- **Card key**: use `course._id` instead of `course.title` (titles aren't
  guaranteed unique long-term; `_id` is stable).
- Keep everything else on the page (header, hero, search bar, decorative
  footer) unchanged.

## Expected files

- `web/sanity/queries/course.ts` — add `lessonDurations` projection to
  `COURSES_QUERY`.
- `web/sanity.types.ts` — regenerated via `npx sanity typegen generate` (run
  from `studio/`) to add the new field to `COURSES_QUERY_RESULT`.
- `web/app/page.tsx` — convert `Home` to an async server component, fetch
  `getCourses()`, replace the static array and `CourseCard`/`CourseMark`
  rendering with real data.

## Requirements

- Homepage remains a server component; data fetching stays server-side using
  the existing `sanityFetch` / `getCourses()` helper (no new client-side
  Sanity calls, no token exposure).
- No visual regressions to the header, hero, or footer sections.
- Cards remain responsive (3-col desktop grid, stacking on mobile) exactly as
  today, just with more cards (10 instead of 3).
- Images loaded through `next/image` + `urlFor()`, consistent with the course
  detail page (Sanity CDN already allow-listed in `next.config.ts`).

## Security considerations

- No new data exposure: all fields queried are already public-facing content
  fields (title, summary, level, cover image, counts) — same trust boundary
  as the existing course detail page.
- No write paths added; this is read-only content rendering.

## Acceptance criteria

- Homepage "All Courses" grid renders the 10 real seeded course titles (no
  more "Next.js for Production" / "Docker Essentials" / "TypeScript Deep
  Dive" placeholders).
- Each card links to its real `/courses/[slug]` page and navigates correctly.
- Level, duration, and module count on each card reflect real Sanity data.
- `npm run lint`, `tsc --noEmit`, and `npm run build` pass in `web/`.

## Checks

- `web/`: `npm run lint`, `./node_modules/.bin/tsc --noEmit`, `npm run build`.
- `studio/`: regenerate TypeGen types after the query change.

## Manual test steps

1. Start the dev server (`cd web && npm run dev`) and open `/`.
2. Confirm the "All Courses" grid shows 10 real seeded course cards with
   correct titles, levels, durations, and module counts.
3. Click a card and confirm it navigates to the matching `/courses/[slug]`
   detail page.
4. Resize to a mobile viewport (~390px) and confirm the grid stacks cleanly
   with no overflow.
