# Vertex content model, standalone Studio, and read data layer

## Goal

Stand up the Sanity content model for Vertex (course, module, lesson, instructor, category), move the Studio out of the Next.js app into its own standalone workspace per AGENTS.md section 5, and build the server-only read client plus GROQ data layer that the (not-yet-built) catalog/course/lesson pages will consume. No page UI is built in this task.

## Skills and context reviewed

- AGENTS.md sections 1, 2, 5, 6, 7, 8, 12, 13.
- `.agents/skills/sanity-best-practices/SKILL.md` and references: `schema.md`, `nextjs.md`, `typegen.md`, `project-structure.md`, `studio-structure.md`, `groq.md`.
- Existing repo: root `sanity.config.ts` / `sanity.cli.ts`, `app/studio/[[...tool]]/page.tsx` (embedded Studio, `NextStudio`), `sanity/env.ts`, `sanity/lib/client.ts` (CDN client, no token), `sanity/lib/live.ts` (unused `defineLive`/`SanityLive`, not wired into `app/layout.tsx`), `sanity/lib/image.ts`, `sanity/schemaTypes/index.ts` (empty), `sanity/structure.ts` (default list), single root `package.json`.
- Confirmed `SanityLive`/`defineLive` are not referenced anywhere in `app/`, so nothing depends on them today.

## Decisions and assumptions

- **Workspace split (per your answer):** create `studio/` (standalone Sanity Studio, Vite-based) and `web/` (the Next.js app), both living at the repo root. `AGENTS.md`, `CLAUDE.md`, `README.md`, `prompts/`, `design/`, `.agents/`, `.claude/` stay at the repo root. No root `package.json` / workspace tooling is added (matches the "no workspace tooling required" note in `project-structure.md`); each app manages its own dependencies and is run from its own folder.
- `app/studio/[[...tool]]/page.tsx` and the `next-sanity/studio` embedding are deleted. `sanity`, `@sanity/vision`, and `styled-components` (Studio-only, used by `sanity`) are removed from the web dependency list; `next-sanity` and `@sanity/image-url` stay (needed for fetching/image URLs).
- Everything currently at repo root that belongs to the Next.js app (`app/`, `public/`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `next-env.d.ts`, `proxy.ts`, `package.json`, `package-lock.json`, `.env.local`) moves into `web/`. The existing `sanity/` folder (env, image helper) is rebuilt inside `web/sanity/` as the read-only data layer; `sanity/schemaTypes` and `structure.ts` move into `studio/`.
- **Live Content API dropped.** `defineLive`'s `browserToken` would put the read token in the client bundle, which conflicts with AGENTS.md ("the browser holds no token"). Since the dataset must be private, I replace `sanity/lib/live.ts` with a plain server-only `sanityFetch` helper (`client.fetch` + Next.js cache tags), and delete `live.ts`. If real-time editing/Visual Editing is wanted later, it's a separate follow-up.
- **Dataset privacy / token:** the client is built to require `SANITY_API_READ_TOKEN` server-side and sets `useCdn: false` (token-authenticated requests bypass the CDN regardless). I cannot flip the dataset's visibility to private or mint a real API token from here — that needs an authenticated `sanity login` / Sanity Manage action. This is called out under "Needs your attention" in my closing report; until a real token exists, local dev can keep the dataset public and simply omit the token (client still works, just without the private-dataset guarantee).
- **Module numbering** (`Module 5`, `Lesson 5.1`) is derived, never stored — computed by the data-layer helpers from array order, not queried as a stored field.
- **Lesson → course lookup** is a reverse reference (`*[_type == "course" && references(^._id)]`) since lessons don't store their parent course.
- **Learning outcomes** (`{ icon, title, description }`) model `icon` as a plain string field (a design-system icon key), since no icon picker component exists yet — pages decide how to render it.
- **Resources** (`{ type, title, description, url }`) model `type` as a `string` with a fixed `options.list` (`link`, `video`, `download`, `file`) per the schema skill's boolean/list guidance.
- **Duration** is stored as a display string (e.g. `"12:34"`), matching "a duration" in AGENTS.md section 8 with no further detail implied.
- Slugs are unique per document type; lesson routing will be `/courses/[courseSlug]/lessons/[lessonSlug]`, so lesson fetch queries take both slugs.
- TypeGen is configured in `studio/sanity.cli.ts` to scan `../web` and generate `../web/sanity.types.ts`, per `typegen.md`'s monorepo pattern. I will run the extract + generate commands once dependencies are installed, so `web/sanity.types.ts` is committed.

## Files expected to touch

Create:

- `studio/package.json`, `studio/sanity.config.ts`, `studio/sanity.cli.ts`, `studio/tsconfig.json`, `studio/.gitignore`
- `studio/schemaTypes/index.ts`
- `studio/schemaTypes/documents/course.ts`, `lesson.ts`, `instructor.ts`, `category.ts`
- `studio/schemaTypes/objects/module.ts`, `learningOutcome.ts`, `resource.ts`
- `studio/structure.ts`
- `web/package.json`, `web/next.config.ts`, `web/eslint.config.mjs`, `web/postcss.config.mjs`, `web/tsconfig.json`, `web/proxy.ts` (moved as-is)
- `web/sanity/env.ts`, `web/sanity/lib/client.ts`, `web/sanity/lib/image.ts`, `web/sanity/lib/fetch.ts`
- `web/sanity/queries/course.ts`, `lesson.ts`, `instructor.ts`, `category.ts`
- `web/sanity/lib/data.ts` (typed helper functions built on the queries)
- `.env.example` at repo root (canonical list of all env vars per AGENTS.md section 12)

Move (git mv, preserving history where practical):

- `app/`, `public/`, `next-env.d.ts`, `.env.local` → `web/`
- root `package.json`, `package-lock.json` → `web/`

Delete:

- root `sanity.config.ts`, `sanity.cli.ts`
- `sanity/` (old root folder, replaced by `web/sanity/` + `studio/schemaTypes`)
- `web/app/studio/[[...tool]]/page.tsx` (embedded Studio route)

## Requirements

### Schema (`studio/schemaTypes`)

- `course` (document): `title`, `slug`, `summary` (text), `coverImage` (image w/ hotspot), `level` (string list: Beginner/Intermediate/Advanced), `price` (number), `popular` (boolean, optional), `studentCount` (number), `learningOutcomes` (array of `learningOutcome` objects), `instructor` (reference → instructor), `category` (reference → category), `modules` (array of `module` objects, ordered).
- `module` (object, embedded — not a document): `title`, `summary`, `lessons` (array of references → lesson, ordered).
- `lesson` (document): `title`, `slug`, `videoUrl` (url), `poster` (image), `duration` (string), `freePreview` (boolean), `studentCount` (number), `notes` (Portable Text array), `keyPoints` (array of strings), `proTip` (text, optional), `resources` (array of `resource` objects).
- `instructor` (document): `name`, `slug`, `photo` (image w/ hotspot), `expertise` (string), `bio` (text).
- `category` (document): `title`, `slug`, `description` (text).
- Shared object types: `learningOutcome` (`icon` string, `title`, `description`), `resource` (`type` string list, `title`, `description`, `url`).
- Use `defineType` / `defineField` / `defineArrayMember` throughout, an icon from `@sanity/icons/*` on every document type, `slug` fields sourced from `title`/`name` with `maxLength`, and `validation: rule => rule.required()` on the fields called out as required in AGENTS.md section 8 (titles, slugs, references, `videoUrl`).
- Add `preview` configs (title/subtitle/media) for course, lesson, instructor so Studio lists are legible.

### Studio structure (`studio/structure.ts`, `studio/sanity.config.ts`)

- List courses, instructors, categories as top-level document type lists.
- Do not list `module`/`learningOutcome`/`resource` (they're objects, not documents — no desk entry needed).
- `sanity.config.ts`: `structureTool`, `visionTool`, schema import; `sanity.cli.ts`: `api.projectId`/`dataset` from `SANITY_STUDIO_*` env vars, plus `typegen` config (`path: "../web/**/*.{ts,tsx}"`, `schema: "schema.json"`, `generates: "../web/sanity.types.ts"`, `overloadClientMethods: true`).

### Read client & data layer (`web/sanity`)

- `client.ts`: `createClient` from `next-sanity` with `projectId`, `dataset`, `apiVersion`, `useCdn: false`, `token: process.env.SANITY_API_READ_TOKEN` (server-only env var, never `NEXT_PUBLIC_*`).
- `fetch.ts`: a `sanityFetch({ query, params, tags, revalidate })` server-only helper wrapping `client.fetch` with Next.js `next: { tags, revalidate }` cache options, following the manual-caching pattern in `nextjs.md`. No client component, no token exposed to the browser.
- `queries/*.ts`: `defineQuery` GROQ for:
  - `COURSES_QUERY` (catalog list): card fields + `instructor->`, `category->`, derived counts.
  - `COURSE_SLUGS_QUERY`, `LESSON_SLUGS_QUERY` (for `generateStaticParams`, not wired to pages yet but exported for later use).
  - `COURSE_BY_SLUG_QUERY`: full course + expanded `instructor->`, `category->`, `modules[]{ title, summary, lessons[]->{ _id, title, slug, duration, freePreview } }`.
  - `LESSON_BY_SLUG_QUERY(courseSlug, lessonSlug)`: lesson fields + resources + notes, plus the reverse-referenced course (`title`, `slug`) for breadcrumb/back-link use.
  - `INSTRUCTOR_BY_SLUG_QUERY`, `CATEGORY_BY_SLUG_QUERY`: profile fields + the courses that reference them.
- `data.ts`: typed helper functions (`getCourses`, `getCourseBySlug`, `getLessonBySlug`, `getInstructorBySlug`, `getCategoryBySlug`) that call `sanityFetch` with the right tags (`course`, `lesson`, `instructor`, `category`) and compute derived module/lesson numbering (`moduleNumber`, `lessonNumber` like `5.1`) from array position after the fetch, not in GROQ.
- All functions return `null`/`undefined` on missing docs; no `notFound()` calls here since no pages consume this yet.

### Env & config

- `.env.example` (repo root, canonical): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`, plus the existing Clerk vars, all with placeholder values (no real secrets).
- `web/.env.local`: moved from root, add empty `SANITY_API_READ_TOKEN=` placeholder for the user to fill in.
- `studio/.env`: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` (Studio/Vite only exposes `SANITY_STUDIO_*`-prefixed vars), copied from the current project id/dataset.
- Update `README.md` with the two-workspace dev instructions (`cd studio && npm install && npm run dev`, `cd web && npm install && npm run dev`) and the CORS step (`npx sanity cors add http://localhost:3000 --credentials`, run from `studio/`).

## Security considerations

- `SANITY_API_READ_TOKEN` is read only server-side (`web/sanity/lib/client.ts`), never referenced with `NEXT_PUBLIC_` prefix, never imported by a `'use client'` file.
- No real tokens or project secrets are written to any tracked file; `.env.local` and `studio/.env` stay git-ignored, `.env.example` only has placeholders.
- Data layer performs reads only — no mutation/write client is introduced in this task.

## Acceptance criteria

- `studio/` runs standalone (`npm run dev` inside `studio/`) and shows Course, Instructor, Category document lists with the modeled fields; creating a course lets you add modules inline and pick lessons by reference.
- `web/` no longer has a `/studio` route; the app still builds and type-checks after the move.
- `web/sanity/lib/client.ts` throws no client-side token exposure (verified by checking no `NEXT_PUBLIC_` var carries the token and no client component imports it).
- `web/sanity/lib/data.ts` functions compile against `web/sanity.types.ts` generated by TypeGen (i.e., `getCourses()` etc. are fully typed, not `any`).
- Repo root `.env.example` lists every env var used by both workspaces with placeholders.

## Checks to run

- In `studio/`: `npx sanity schemas extract --force && npx sanity typegen generate` (generates `web/sanity.types.ts`), then confirm `studio` builds/deploys cleanly enough to run locally.
- In `web/`: `npm run lint`, TypeScript type check (`npx tsc --noEmit` or the project's configured check), `npm run build`.

## Manual test steps

1. From `studio/`, run `npm install` then `npm run dev`; open the local Studio URL and confirm Course/Instructor/Category lists appear, and a course document lets you add a module with title/summary and pick lessons by reference.
2. Create one sample instructor, one category, one lesson, and one course referencing them, to confirm the reference pickers and Portable Text notes field work end to end.
3. From `web/`, run `npm install` then `npm run dev`; confirm `/studio` now 404s (route removed) and the rest of the app (`/`, `/sign-in`, `/design-system`) still loads.
4. Add a temporary debug call to `getCourses()` (e.g. in a scratch server file or via `npx tsx`) to confirm it returns the sample course with computed module/lesson numbers, then remove the scratch file.

## Needs your attention (anticipated, will restate in final report)

- A real `SANITY_API_READ_TOKEN` must be created via Sanity Manage (or `sanity login` + token creation) and added to `web/.env.local` — I cannot mint this without interactive auth.
- Confirm whether the dataset should be switched to private now or later; the client is written to support a private dataset once the token exists.
