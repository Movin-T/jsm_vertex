'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import posthog from 'posthog-js';

import type { SearchResponse, SearchResult } from '@/sanity/search/types';

type Sort = 'relevant' | 'videos' | 'lessons';
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'done'; data: SearchResponse };

const MARK_PALETTE = [
  'bg-[#101010]',
  'bg-[#397cc9]',
  'bg-[#ed6a45]',
  'bg-[#2f6f4f]',
];

/** Formats whole seconds as mm:ss (or h:mm:ss). */
function clock(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/** Renders a decorative interface glyph. */
function Icon({
  name,
  className = 'h-4 w-4',
}: {
  name: 'search' | 'arrow' | 'play' | 'doc' | 'folder' | 'external' | 'chevron';
  className?: string;
}) {
  const shared = `${className} fill-none stroke-current stroke-[1.7]`;
  const paths: Record<typeof name, React.ReactNode> = {
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.2" />
        <path d="m16 16 4.2 4.2" strokeLinecap="round" />
      </>
    ),
    arrow: (
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    play: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m10.3 8.8 5 3.2-5 3.2V8.8Z" strokeLinejoin="round" />
      </>
    ),
    doc: (
      <path
        d="M7 3.8h6.5L18 8.3v11.9H7V3.8ZM13.5 3.8v4.5H18M9.5 12.5h5m-5 3h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    folder: (
      <path
        d="M4 6.8h5l1.8 2H20v9.4H4V6.8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    external: (
      <path
        d="M13 5h6v6m0-6-8 8M17 14v5H5V7h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    chevron: (
      <path d="m7 10 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

/** Course image, or an initials mark when the course has no cover. */
function CourseMark({ result }: { result: SearchResult }) {
  if (result.courseImage) {
    return (
      <Image
        src={result.courseImage}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 rounded-[5px] object-cover"
      />
    );
  }
  const words = result.courseTitle.split(/\s+/).filter(Boolean);
  const initials = (
    (words[0]?.[0] ?? '') + (words[1]?.[0] ?? '')
  ).toUpperCase();
  const tone =
    MARK_PALETTE[
      result.courseSlug.split('').reduce((t, c) => t + c.charCodeAt(0), 0) %
        MARK_PALETTE.length
    ];
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-[5px] text-[10px] font-semibold text-white ${tone}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/** One ranked result card, matching the video or lesson design. */
function ResultCard({
  result,
  query,
}: {
  result: SearchResult;
  query: string;
}) {
  const isVideo = result.kind === 'video';
  const action = isVideo
    ? `Watch from ${clock(result.matchedSeconds ?? 0)}`
    : 'View lesson';

  return (
    <article className="relative grid gap-4 rounded-[12px] border border-[#eee7e1] bg-white/60 p-4 transition hover:border-[#f3a080] hover:shadow-[0_14px_30px_rgba(82,46,29,0.08)] md:grid-cols-[276px_1fr] md:gap-7 md:p-[18px]">
      {isVideo ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-[10px] bg-[#16171a] md:h-[142px] md:aspect-auto">
          {result.thumbnail && (
            <Image
              src={result.thumbnail}
              alt=""
              fill
              sizes="(min-width: 768px) 276px, 100vw"
              className="object-cover"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white">
              <Icon name="play" className="h-7 w-7" />
            </span>
          </span>
          {result.duration && (
            <span className="absolute bottom-2.5 right-2.5 rounded-[5px] bg-black/75 px-2 py-1 text-[11px] font-medium text-white">
              {result.duration}
            </span>
          )}
        </div>
      ) : (
        <div className="flex min-h-[110px] gap-3 rounded-[10px] bg-[#faf6f2] p-4 md:h-[110px]">
          <Icon name="doc" className="mt-0.5 h-5 w-5 shrink-0 text-[#68717d]" />
          <ul className="space-y-1.5 text-[11px] text-[#4b4a49]">
            {result.keyPoints.map((point) => (
              <li key={point} className="flex gap-2">
                <span aria-hidden="true">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5 text-[12px] text-[#4b4a49]">
            <CourseMark result={result} />
            <span className="truncate">{result.courseTitle}</span>
          </div>
          <span
            className={`shrink-0 rounded-[5px] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${
              isVideo
                ? 'bg-[#fdeee8] text-[#ed6a45]'
                : 'bg-[#eeedf7] text-[#5b57a8]'
            }`}
          >
            {isVideo ? 'Video' : 'Lesson'}
          </span>
        </div>

        <h3 className="mt-3 text-[18px] font-medium leading-snug tracking-[-0.02em] text-[#1b1917]">
          <Link
            href={result.href}
            onClick={() =>
              posthog.capture('search_result_clicked', {
                query,
                kind: result.kind,
                lesson_slug: result.lessonSlug,
                course_slug: result.courseSlug,
              })
            }
            className="after:absolute after:inset-0 after:rounded-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a45]"
          >
            {result.title}
          </Link>
        </h3>
        {result.description && (
          <p className="mt-2 max-w-[520px] text-[12.5px] leading-[1.6] text-[#68717d]">
            {result.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[11.5px] text-[#68717d] md:mt-auto md:pt-3">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {isVideo ? (
              <>
                <span className="flex items-center gap-1.5">
                  <Icon name="doc" className="h-3.5 w-3.5" />
                  Lesson {result.lessonNumber}
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="folder" className="h-3.5 w-3.5" />
                  {result.moduleTitle}
                </span>
              </>
            ) : (
              <span>Module {result.moduleNumber}</span>
            )}
          </span>
          <span className="flex items-center gap-2 font-medium text-[#ed6a45]">
            {isVideo && <Icon name="play" className="h-4 w-4" />}
            {action}
            {!isVideo && <Icon name="external" className="h-3.5 w-3.5" />}
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

/** Pulsing placeholder rows shown while the search runs. */
function Skeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-[178px] animate-pulse rounded-[12px] border border-[#eee7e1] bg-white/60"
        />
      ))}
    </div>
  );
}

function CatalogBanner({ heading }: { heading: string }) {
  return (
    <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-[12px] bg-[#fdf0ea] p-5 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fbd9cc] text-[#ed6a45]">
          <Icon name="search" className="h-6 w-6" />
        </span>
        <div>
          <p className="text-[14px] font-medium text-[#1b1917]">{heading}</p>
          <p className="text-[12px] text-[#68717d]">
            Try different keywords or browse our full course catalog.
          </p>
        </div>
      </div>
      <Link
        href="/courses"
        className="inline-flex items-center gap-3 rounded-[8px] border border-[#eee2da] bg-white px-5 py-3 text-[13px] font-medium text-[#ed6a45] transition hover:bg-[#fffaf7]"
      >
        Browse all courses <Icon name="arrow" className="h-4 w-4" />
      </Link>
    </div>
  );
}

/** Full results page body: heading, search box, sort, ranked results and the catalog banner. */
export function SearchResults({ query }: { query: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(query);
  const [sort, setSort] = useState<Sort>('relevant');
  const [state, setState] = useState<State>(
    query.length >= 2 ? { status: 'loading' } : { status: 'idle' },
  );

  useEffect(() => {
    if (query.length < 2) return;
    const controller = new AbortController();

    fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Search failed');
        return response.json() as Promise<SearchResponse>;
      })
      .then((data) => {
        setState({ status: 'done', data });
        posthog.capture('search_performed', {
          query,
          result_count: data.total,
        });
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setState({ status: 'error' });
      });

    return () => controller.abort();
  }, [query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    if (state.status !== 'done') return [];
    const list = state.data.results;
    if (sort === 'relevant') return list;
    const first = sort === 'videos' ? 'video' : 'lesson';
    return [...list].sort(
      (a, b) => Number(b.kind === first) - Number(a.kind === first),
    );
  }, [state, sort]);

  const total = state.status === 'done' ? state.data.total : 0;
  const courseCount = state.status === 'done' ? state.data.courseCount : 0;

  return (
    <section className="mx-auto max-w-[1100px] px-5 pb-16 pt-10 md:px-8 md:pt-12">
      <div className="flex flex-col items-center text-center">
        <span className="rounded-[6px] border border-[#f3e2da] bg-[#fffaf7] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e86440]">
          Search results
        </span>
        <h1 className="mt-6 font-display text-[34px] leading-[1.1] tracking-[-0.05em] text-[#111111] md:text-[44px]">
          {query ? (
            <>
              Results for <span className="text-[#ed6a45]">“{query}”</span>
            </>
          ) : (
            'Search your learning'
          )}
        </h1>
        <p
          className="mt-3 min-h-6 text-[14px] text-[#69727e]"
          aria-live="polite"
        >
          {state.status === 'loading' && 'Searching…'}
          {state.status === 'done' &&
            `Found ${total} ${total === 1 ? 'result' : 'results'} across ${courseCount} ${courseCount === 1 ? 'course' : 'courses'}`}
        </p>

        <form
          role="search"
          className="mt-6 flex w-full max-w-[720px] items-center gap-3 rounded-[10px] border border-[#eee2da] bg-white/70 px-4 py-3.5 text-left shadow-[0_3px_12px_rgba(64,37,22,0.04)]"
          onSubmit={(event) => {
            event.preventDefault();
            const next = draft.trim();
            if (next.length >= 2)
              router.push(`/search?q=${encodeURIComponent(next)}`);
          }}
        >
          <label htmlFor="search-query" className="sr-only">
            Search your learning
          </label>
          <Icon name="search" className="h-6 w-6 shrink-0 text-[#45494e]" />
          <input
            id="search-query"
            ref={inputRef}
            type="search"
            value={draft}
            maxLength={200}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask anything about your learning..."
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[#31363c] outline-none placeholder:text-[#9aa0aa]"
          />
          <kbd className="hidden rounded-[6px] border border-[#eee2da] bg-[#fffdfb] px-2.5 py-1.5 text-[12px] text-[#60656b] sm:block">
            ⌘ K
          </kbd>
        </form>
      </div>

      <div className="mt-10">
        {state.status === 'done' && total > 0 && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-[15px] font-medium text-[#1b1917]">
              {total} results
            </p>
            <div className="relative">
              <label htmlFor="search-sort" className="sr-only">
                Sort results
              </label>
              <select
                id="search-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as Sort)}
                className="appearance-none rounded-[8px] border border-[#eee2da] bg-white/70 py-2.5 pl-4 pr-10 text-[13px] text-[#31363c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a45]"
              >
                <option value="relevant">Most Relevant</option>
                <option value="videos">Videos first</option>
                <option value="lessons">Lessons first</option>
              </select>
              <Icon
                name="chevron"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#45494e]"
              />
            </div>
          </div>
        )}

        {state.status === 'loading' && <Skeleton />}
        {state.status === 'error' && (
          <p
            role="alert"
            className="rounded-[10px] border border-[#f3d6cb] bg-[#fff6f2] p-4 text-[13px] text-[#a1432a]"
          >
            Search is unavailable right now. Please try again.
          </p>
        )}
        {state.status === 'done' && (
          <ul className="space-y-4">
            {results.map((result) => (
              <li key={result.lessonId}>
                <ResultCard result={result} query={query} />
              </li>
            ))}
          </ul>
        )}

        {state.status !== 'loading' && (
          <CatalogBanner
            heading={
              query
                ? 'Can’t find what you’re looking for?'
                : 'Type a topic to get started'
            }
          />
        )}
      </div>
    </section>
  );
}
