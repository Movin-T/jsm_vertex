# Vertex Intelligent Search Implementation

## Goal

Add plain-language search: a Sanity Context document and MCP connection, a server-side search API (`POST /api/search`) that has an LLM query the content through the MCP, and a full results page at `/search?q=` (design: `design/vertex-search.png`) showing ranked video and lesson result cards with a count and sort control.

## Skills and guidance read

- `AGENTS.md` (sections 5, 7, 10, 11, 12, 13): grounded search, results page not chatbox, server/client boundaries, private dataset and token, Context doc as config, inline prompt plus Context doc rules.
- `create-agent-with-sanity-context` (+ `references/nextjs-agent.md`, `studio-setup.md`, `system-prompts.md`): MCP over HTTP with Bearer token, `/initial-context` fetched once and injected, `initial_context` tool excluded, Context URL with slug.
- `dial-your-context`, `shape-your-agent`: how the instructions, content filter, and prompt tone/guardrails are written (short deltas, not schema restatement).
- `sanity-best-practices`, `next-best-practices`: GROQ, TypeGen, route handlers, server/client boundaries. Next 16 docs in `web/node_modules/next/dist/docs/` will be read for route handlers and `searchParams` before coding.

## Code inspected

- `web/sanity/lib/{client,fetch,data,video,duration,image}.ts`, `web/sanity/queries/*`, `web/sanity.types.ts`: server-only client reads the private dataset with `SANITY_API_READ_TOKEN`; `getLessonBySlug` already derives module/lesson numbering.
- `web/app/courses/[slug]/lessons/[lessonSlug]/page.tsx`: the lesson page already reads `?t=<seconds>` and starts the YouTube embed there. Search deep links reuse `?t=`.
- `web/components/site-header.tsx`, `web/app/page.tsx` (search glyph/palette), `web/proxy.ts` (Clerk; nothing protected, so `/search` and `/api/search` stay public), `web/package.json`.
- `studio/sanity.config.ts`, `studio/package.json`, `studio/schemaTypes/**`, `studio/scripts/seed/*`.
- `design/vertex-search.png`.

## Findings that shape the work

- **No `video` documents exist** (no schema, no seed, no ingestion). Transcripts and chapters are not in the dataset, so no video moment can be grounded today. Per AGENTS.md section 9, ingestion is separate offline tooling and you asked for search over courses and lessons, so it is out of scope here.
- **`@sanity/context` Studio plugin cannot be used**: it peers on `sanity ^6`, Studio is on `sanity ^5.31`. The `sanity.agentContext` document will be created by import instead (AGENTS.md section 12). Conversation Insights is unavailable.
- The Context MCP only serves a dataset with a deployed Studio application. I will check and run `sanity deploy` if it is missing.
- Not yet in `web`: `ai`, `@ai-sdk/openai`, `@ai-sdk/mcp`, `@ai-sdk/react`, `zod`. Latest on npm: `ai` 7.0.137, `@ai-sdk/openai` 4.0.91, `@ai-sdk/mcp` 2.0.73, `zod` 4.6.6. I will confirm the AI SDK 7 API against its docs/types before writing code (structured output, MCP client, `stopWhen`).
- `web/.env.local` has the Sanity read token but no `OPENAI_API_KEY`; there is no `.env.example` yet.

## Decisions and assumptions

- **Result kinds.** The API response type supports `video` and `lesson` results. Because no video documents exist, only **lesson results** can be produced now; the video card, its "Watch from mm:ss" action, and `?t=` link are built to the design and activate once video documents exist. I will not fabricate timestamps or promote lessons to "video" results.
- **Grounding by id, hydrated server-side.** The model never writes display data. It queries via `groq_query` and returns only an ordered list of `{ kind, lessonId, matchedSeconds? , reason? }` validated with Zod. The server then re-fetches each lesson by `_id` with a fixed GROQ query (course, module, derived lesson number, thumbnail, duration, key points, description) and drops any id that does not resolve. All card fields come from Sanity, so nothing can be invented. Ranking is the model's order (specific title match beats broad hit).
- **Courses.** Course matches are used to find lessons (a query about "React" surfaces its lessons); results remain lesson cards labelled with their course. "Found N results across M courses" is computed from the hydrated results.
- **Delivery.** Hydration needs the complete id list, so the route returns a single JSON response (not a token stream); the client shows a loading skeleton. This deviates from "streams results back" in AGENTS.md section 5 deliberately and is flagged below.
- **Module/lesson label** ("Lesson 5.1 in Data Fetching & Caching", "Module 5") is derived from course module order, as on the lesson page. Description for a lesson result is a short plain-text excerpt from `notes` (first block, trimmed) via GROQ `pt::text`; if empty, the first key point.
- **Model.** OpenAI via `@ai-sdk/openai`; model id from `OPENAI_MODEL` env with a sensible default chosen after checking the SDK, bounded by a max step count.
- **Context document.** `sanity.agentContext` named "Vertex Search", slug `vertex-search`, `groqFilter`: `_type in ["course","lesson","instructor","category","video"]` (video types included so it works when ingested; it never surfaces them directly). `instructions` hold short deltas only: text match is token based so wildcard and OR keywords, no whole-phrase match, match `pt::text(notes)` not `notes`, lessons have no parent so find the course with a reverse reference `references(^._id)`, modules are embedded in `course.modules[]`, never return `notes`/chunks wholesale, ranking by specificity, return `_id`s. The same critical rules are duplicated in the inline system prompt (more reliably followed).
- **Prompt caching.** `/initial-context` is fetched once per server process and cached in module scope; prompt/instruction changes need a dev-server restart (AGENTS.md section 12).
- **MCP URL** from env `SANITY_CONTEXT_MCP_URL` (`https://api.sanity.io/<apiVersion>/context/mcp/<projectId>/<dataset>/vertex-search`), Bearer `SANITY_API_READ_TOKEN`. I will check the token has access to the MCP; if not I will ask you for a Viewer token rather than create one.
- **Search page.** Server `page.tsx` reads `q` and renders `SiteHeader` plus a client `SearchResults` that calls `/api/search`. Search box (with the `⌘K` hint focusing the input) updates the URL. Count line, "N results", sort select (Most relevant default, Videos first, Lessons first; sorting is client-side over returned results). Empty state and error state show the "Can't find what you're looking for?" banner with "Browse all courses" → `/courses`. Result card click opens `/courses/<course>/lessons/<lesson>` (+ `?t=` for video moments).
- **Entry points.** The existing home page search input (and a header-level search if one exists in the design) submits to `/search?q=`. I will read the home page code to wire it without restyling.
- **Responsive.** Desktop matches the reference; on mobile cards stack (thumbnail above content), action rows wrap.
- **Not building:** video ingestion, a chat UI, Conversation Insights, semantic search (`text::semanticSimilarity`, embeddings not assumed), progress features.

## Files expected to touch

- `web/package.json` (+ lockfile): `ai`, `@ai-sdk/openai`, `@ai-sdk/mcp`, `@ai-sdk/react` (only if used), `zod`.
- `web/.env.example` (new): canonical env list. `web/.env.local`: you add `OPENAI_API_KEY`, `SANITY_CONTEXT_MCP_URL` (I will not print or commit secrets).
- `web/app/api/search/route.ts` (new): validate input, call search service, return JSON.
- `web/sanity/search/{mcp,prompt,run-search,hydrate,schema}.ts` (new, `server-only`): MCP client, system prompt, orchestration, Zod schemas, hydration query.
- `web/app/search/page.tsx`, `web/app/search/search-results.tsx` (new): results page and client component.
- `web/app/page.tsx` (and `site-header.tsx` only if the design has a header search): route the search input to `/search`.
- `studio/scripts/context/vertex-search.ndjson` (new) + short README note in the script: the `sanity.agentContext` document, imported with the Sanity CLI.
- `web/sanity.types.ts`: regenerated by TypeGen if new `defineQuery` queries are added.

## Requirements

- `POST /api/search` body `{ query: string }`, trimmed, 2 to 200 chars, Zod-validated; 400 on bad input; generic 5xx message on failure (no stack/secrets leaked). Returns `{ query, total, courseCount, results: [...] }`.
- The model gets MCP tools (`groq_query`, `schema_explorer`; `initial_context` excluded) and must only return ids; tool results are never returned to the client wholesale.
- Results ranked best first, not capped to a handful (cap only by a sane maximum, e.g. 30, to bound cost), deduplicated by lesson.
- Empty state links to the full catalog; loading and error states present.
- PostHog: `search_performed` (query, result count) and `search_result_clicked` (kind, lesson slug), using the existing browser client.
- Accessibility: search landmark and labelled input, results as a list, buttons/links with visible focus, sort select labelled.

## Security considerations

- `SANITY_API_READ_TOKEN`, `OPENAI_API_KEY`, and the MCP URL are read only in `server-only` modules; none are `NEXT_PUBLIC_`. Browser never calls the MCP or LLM.
- The dataset stays private; MCP tools are read-only. User query is untrusted input (prompt injection): the model can only output ids, ids are validated against Sanity before display, and the content filter limits visible types.
- Input length cap and a max model-step cap bound cost; a basic per-IP rate limit is not included (see below). Route does not write any data.
- Rendered text comes from Sanity as plain strings (React escapes it); no `dangerouslySetInnerHTML`. `react-markdown` is not needed because there is no prose reply.

## Acceptance criteria

1. `/search?q=data fetching` shows the header, "Results for “data fetching”", a count line, the search box, sort control, and ranked lesson cards that all come from Sanity, each linking to the real lesson page.
2. Every card's course, module/lesson label, key points, and description match the Sanity document it links to; no result exists that is not in the dataset.
3. A nonsense query shows the empty state with "Browse all courses".
4. Network tab shows no token or MCP/OpenAI call from the browser; only `/api/search`.
5. Home page search submits to `/search?q=…`.
6. Video cards render correctly from a mocked result and link with `?t=`, but no real video result appears until video documents exist.

## Checks to run

In `web`: `npm run lint`, `npx tsc --noEmit`, `npm run build`. TypeGen if queries are added. In `studio`: confirm the Studio application is deployed (`sanity deploy` if not), import the Context document. Verify against the live MCP endpoint with a `tools/list` and `/initial-context` call, then call `/api/search` with a few real queries and report the real output.

## Manual test steps

1. Add `OPENAI_API_KEY` and `SANITY_CONTEXT_MCP_URL` to `web/.env.local`; restart `npm run dev` in `web`.
2. Open `http://localhost:3000/search?q=server components`, then `?q=caching`, then `?q=zzzxq`.
3. Confirm the count, sort control, card links, and empty state; click a card and confirm the lesson opens.
4. From the home page, type a query in the search input and submit.
5. Open DevTools Network and confirm no secrets or MCP/OpenAI calls from the browser.
6. Resize to mobile width and confirm cards stack.
