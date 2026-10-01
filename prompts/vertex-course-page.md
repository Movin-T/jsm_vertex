# Vertex Course Page Implementation

## Goal

Implement the course detail page shown in `design/vertex-course.png` and populate it from the existing seeded Sanity course content. The route will be `/courses/[slug]`; the seeded Next.js course is `/courses/nextjs-app-router-in-depth`.

## Skills and guidance read

- `AGENTS.md`: approval-first implementation, separate Studio/web workspaces, server-only Sanity reads, responsive reference matching, and required checks.
- `next-best-practices`: server component data reads, Next.js images, and App Router conventions.
- `sanity-best-practices`: Next.js integration and existing GROQ/data patterns.
- Next.js 16.3.4 bundled docs: App Router data fetching, `next/image`, and `generateMetadata`.
- Existing Vertex page styles and the attached course reference.

## Existing code inspected

- `web/app/page.tsx`, `web/app/layout.tsx`, `web/app/globals.css`, and `web/next.config.ts`.
- `web/sanity/lib/data.ts`, `fetch.ts`, `client.ts`, `image.ts`, `sanity/env.ts`, `sanity/queries/course.ts`, and generated `sanity.types.ts`.
- `studio/schemaTypes/documents/course.ts`, `studio/schemaTypes/objects/module.ts`, and the NDJSON seed data.
- The seed contains ten courses; `Next.js App Router in Depth` has four modules, twelve lessons, four learning outcomes, and the slug `nextjs-app-router-in-depth`.
- There is no existing course route, progress store, lesson page, or course bookmark persistence.

## Decisions and assumptions

- Add a general dynamic course route backed by the existing `getCourseBySlug()` server-only data helper. The public course page remains a Server Component and uses `notFound()` for unknown slugs.
- Preserve the screenshot's two-column hero, learning outcomes panel, course-content section, fixed progress/continue footer, header, texture, and coral accent palette. Render text, counts, and imagery from Sanity rather than hard-coding screenshot copy.
- Treat each Sanity module as the numbered expandable row; show its real lesson references when expanded. Derive totals and display durations from the returned lessons and their duration values.
- Reproduce the sticky progress bar's layout without inventing a percentage or completion state. There is no progress data layer to read yet. The continue action will take the learner to course content, not claim progress is saved.
- Bookmark is an explicitly local, in-page toggle only; do not write to Sanity or claim persistence.
- Use the existing `urlFor()` image helper with `next/image`; allow only Sanity's image CDN in Next image configuration.
- Keep the current homepage, auth, schema, and seed documents unchanged.

## Expected files

- Add `web/app/courses/[slug]/page.tsx` for server data loading, metadata, and page presentation.
- Add `web/app/courses/[slug]/course-content.tsx` for accessible client-side module expansion and the local bookmark toggle.
- Add `web/sanity/lib/duration.ts` for shared duration parsing and display formatting.
- Update `web/next.config.ts` to allow images from the Sanity CDN.
- Do not change Studio schemas, seed data, or shared Sanity queries unless implementation reveals a concrete query mismatch.

## Requirements

- Match the provided course-page reference at desktop widths and adapt responsively for mobile.
- Show breadcrumb, popular badge when set, cover image, title, summary, level, total course duration, module count, and student count using the selected Sanity document.
- Render learning outcomes from `learningOutcomes`, including their icon keys with a safe generic visual fallback for unknown keys.
- Render modules in Sanity order with derived numbers, module title/summary, lesson count and duration; support keyboard-accessible expand/collapse to show each module's actual lessons.
- Keep lesson/module numbering derived from list order, not stored in the content.
- Add dynamic page metadata using the course title and summary.
- Handle null/optional content safely without fabricated fallback facts; return Next.js not-found UI for an unknown course slug.
- Use semantic landmarks/headings, meaningful image alt text, visible focus indicators, and responsive images with explicit sizing behavior.
- Keep data fetching and Sanity credentials on the server; do not introduce client-side Sanity calls or new dependencies.

## Security considerations

- Reuse the existing server-only Sanity data layer and viewer token; no credentials enter client props or the browser bundle.
- Bookmark state is local only; no browser writes to Sanity or learner data.
- Do not create fictitious user progress or expose private configuration.

## Acceptance criteria

- `/courses/nextjs-app-router-in-depth` renders the seeded course rather than static screenshot copy.
- Every rendered course count, outcome, module, lesson, and duration is derived from fetched content.
- Expanding a module displays only its associated lessons and is operable by keyboard.
- Unknown slugs render the framework not-found response.
- The layout closely follows the supplied reference on desktop and remains readable without horizontal overflow on mobile.
- No new secret, dependency, unrelated route, or Studio change is introduced.

## Checks

- `npm run lint` in `web/`.
- `npx tsc --noEmit` in `web/` (the package currently has no dedicated type-check script).
- `npm run build` in `web/`.
- Run the dev server and inspect the seeded course in a browser at desktop and mobile sizes; check browser/Next.js runtime diagnostics.

## Manual test steps

1. Start the web app from `web/` with `npm run dev`.
2. Open `/courses/nextjs-app-router-in-depth` and verify the live course title, image, outcomes, counts, and modules.
3. Expand and collapse a module with mouse and keyboard; confirm its lesson list matches Sanity.
4. Toggle Bookmark and confirm it changes state only for the current page visit.
5. Activate Continue Learning and confirm it scrolls to course content without claiming saved learner progress.
6. Open `/courses/does-not-exist` and verify the not-found page.
7. Check the page at a narrow mobile viewport for overflow and verify the main controls remain usable.
