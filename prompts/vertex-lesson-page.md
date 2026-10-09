# Vertex Lesson Page Implementation

## Goal

Implement the lesson page from `design/vertex-lesson.png` at `/courses/[courseSlug]/lessons/[lessonSlug]`, rendered from the seeded Sanity content, with the lesson's YouTube video playing on the page via the provider embed.

## Skills and guidance read

- `AGENTS.md`: approval-first flow, read-only pages, server-only Sanity reads, no custom player, exact reference match with responsive adaptation, required checks.
- `next-best-practices`, `sanity-best-practices` (Portable Text, GROQ, TypeGen), `portable-text-serialization`.
- Next.js 16.3.4 bundled docs (async `params`, `generateMetadata`, `generateStaticParams`).

## Code inspected

- `web/app/courses/[slug]/page.tsx` and `course-content.tsx` (page shell, `Icon` pattern, palette, `coral-bars`, `SiteHeader`, PostHog usage).
- `web/sanity/queries/lesson.ts`, `course.ts`, `web/sanity/lib/data.ts` (`getLessonBySlug` already derives `moduleNumber` / `lessonNumber`), `duration.ts`, `image.ts`, `fetch.ts`.
- `studio/schemaTypes/documents/lesson.ts`, `objects/resource.ts`, `web/sanity.types.ts`, seed `seed.ndjson` / `videos.json`.
- `web/proxy.ts` (Clerk middleware, no routes protected, so the lesson page stays public), `next.config.ts`, `web/package.json`.

## Findings that shape the work

- All 120 seeded lessons use `https://www.youtube.com/watch?v=<id>` URLs. YouTube is the only provider needing playback now.
- The seed writes `thumbnail` (with `alt`) and `duration` as a number of seconds, while the Studio schema and `LESSON_BY_SLUG_QUERY` use `poster` and a string duration. I will verify what the live dataset actually holds before choosing the field. `durationInSeconds()` already handles numbers and strings.
- `notes` is Portable Text (normal, h2, bullet blocks). `@portabletext/react` is not a direct web dependency (only transitive `@portabletext/*` editor packages exist), so it must be added, as AGENTS.md section 6 already specifies it.
- The design shows a course-level sidebar with module/lesson numbers, progress ("35% complete"), completion checks, a bookmark, a "Notes" tab, previous/next lesson, a notifications bell, and a Pro Tip. The lesson `course` sub-query only returns `{_id, slug}` for lessons, so it needs expanding.
- No progress layer exists. Per AGENTS.md section 7 progress is a separate, later feature, so this page stays presentational for it.

## Decisions and assumptions

- Route `/courses/[courseSlug]/lessons/[lessonSlug]` as a Server Component using `getLessonBySlug`; `notFound()` when the lesson is missing or does not belong to that course.
- Extend `LESSON_BY_SLUG_QUERY` so the course carries `level`, `modules[]{_key,title,lessons[]->{_id,title,slug,duration}}`, and the instructor is not needed. Re-run TypeGen. Derive module/lesson numbers and the previous/next lesson (crossing module boundaries) in `data.ts` from array order, never stored.
- Video: a small client component renders a YouTube `iframe` using the `youtube-nocookie.com/embed/<id>` URL, with `rel=0` and `start=<seconds>` read from a `?t=` query param, so the later search feature can deep link. The id is parsed from `watch?v=`, `youtu.be/`, and `/embed/` forms. Unsupported or unparsable URLs show the poster with a notice instead of a broken frame; Vimeo/Bunny are not implemented and are not claimed as supported (AGENTS.md section 9). The design's custom controls bar is the provider's own player; no custom player is built.
- Sidebar: "Back to course", course mark, title, and the module/lesson tree from real data. Current module is expanded with the current lesson marked "Now playing"; other modules collapse and expand. The design's "35% complete" bar and completion checkmarks are not fabricated: I render the progress bar track with no percentage and no checks, until the progress feature exists. The sidebar collapses on mobile into a toggleable "Course content" panel above the content.
- Tabs: "Lesson Content" (overview from `notes` via `@portabletext/react`, key points as a check list, Pro Tip callout, Resources grid with type-based icon and external link `rel="noopener noreferrer"`) and "Notes" (presentational placeholder, per AGENTS.md section 7). The design's "Overview" heading text comes from `notes`, which is rendered as authored.
- Meta row: duration, course level (from the course), student count, all from Sanity. Breadcrumb: All Courses › course › module › lesson. The "Lesson 5.1" badge is derived.
- Bookmark button is local-only state, matching the course page; a notifications bell and user avatar are already handled by `SiteHeader`.
- Footer bar: Previous/Next lesson links with the neighbouring lesson titles and durations, disabled when absent.
- PostHog: capture `lesson_viewed` on load and `lesson_video_started` when the embed is first played would need the YouTube IFrame API; to keep this small I capture `lesson_viewed` only, and flag video play/watch events as a follow-up.
- Update the course page's lesson rows to link to the new route (otherwise nothing leads here), and have "Continue Learning" stay unchanged.
- Posters/thumbnails use `urlFor()` with `next/image`; `cdn.sanity.io` is already allowed. If seeded thumbnails are YouTube URLs rather than Sanity assets, the `i.ytimg.com` host will be added to `images.remotePatterns` only if needed.

## Files expected to touch

- Add `web/app/courses/[courseSlug]/lessons/[lessonSlug]/page.tsx` (server loading, metadata, layout).
- Add `.../lesson-sidebar.tsx`, `.../lesson-video.tsx`, `.../lesson-tabs.tsx` (client pieces: sidebar toggles, iframe with start param, tabs/bookmark/PostHog).
- Add `web/sanity/lib/video.ts` (YouTube id parsing and embed URL builder).
- Update `web/sanity/queries/lesson.ts`, `web/sanity/lib/data.ts` (prev/next, numbering), regenerate `web/sanity.types.ts`.
- Update `web/app/courses/[slug]/course-content.tsx` and `page.tsx` (lesson links need the course slug).
- Update `web/package.json` (`@portabletext/react`) and, if needed, `web/next.config.ts`.
- No Studio schema, seed, or data changes unless the field mismatch above proves the dataset is wrong, in which case I will stop and ask.

## Requirements

- Match `design/vertex-lesson.png` on desktop (layout, spacing, typography, color, states); responsive on mobile with a stacked layout and collapsible sidebar.
- Every title, number, duration, count, key point, tip, and resource comes from Sanity; no invented progress, completion, or timestamps.
- Video plays on the page in the provider embed, never navigating the learner away, starting at `?t=` seconds when given.
- Semantic landmarks, tab roles with keyboard support, focus-visible styles, meaningful `title` on the iframe and alt text on images, `aria-current` for the active lesson.

## Security considerations

- Data fetched server-side only with the existing token client; nothing sensitive reaches client props.
- Iframe host is fixed (`www.youtube-nocookie.com`); the video id is validated against `^[\w-]{11}$` before being embedded, and `t` is parsed to a non-negative integer.
- Resource URLs are only rendered as links if the protocol is `http(s)`; opened with `rel="noopener noreferrer"`.
- No browser writes, no new secrets.

## Acceptance criteria

- `/courses/nextjs-app-router-in-depth/lessons/nextjs-app-router-in-depth-file-system-routing` renders the seeded lesson and plays its video inline.
- Adding `?t=90` starts playback at 1:30.
- Sidebar, breadcrumb, lesson number, previous/next all derive from the course's real order; first/last lessons disable the missing neighbour.
- Notes render from Portable Text; key points, Pro Tip, and resources render only when present.
- Unknown course/lesson, or a lesson not in that course, returns not-found.
- Course page lesson rows link to the lesson page.

## Checks

- `npx tsc --noEmit`, `npm run lint`, `npm run build` in `web/`.
- In `studio/`: `npx sanity schemas extract --force && npx sanity typegen generate` after the query change.
- Dev server visual check at desktop and mobile widths, and Next.js runtime diagnostics.

## Manual test steps

1. In `web/`, run `npm install` then `npm run dev`.
2. Open the course page, expand a module, and click a lesson.
3. Verify the lesson page matches the reference and the video plays inline.
4. Open the same URL with `?t=90` and confirm the video starts at 1:30.
5. Use Previous/Next, expand other sidebar modules, switch tabs, toggle the bookmark.
6. Visit a bad lesson slug to see not-found, and resize to a narrow viewport to check layout.
