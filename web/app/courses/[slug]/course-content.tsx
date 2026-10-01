'use client';

import { useState } from 'react';
import type { getCourseBySlug } from '@/sanity/lib/data';
import { durationInSeconds, formatDuration } from '@/sanity/lib/duration';

type Course = NonNullable<Awaited<ReturnType<typeof getCourseBySlug>>>;
type CourseModule = Course['modules'][number];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 fill-none stroke-current stroke-[1.8] transition-transform ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={bookmarked}
      onClick={() => setBookmarked((saved) => !saved)}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] border px-4 text-[13px] transition focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ed6a45] ${
        bookmarked
          ? 'border-[#e66a46] bg-[#fff0ea] text-[#c9502f]'
          : 'border-[#e9dfd8] bg-transparent text-[#282522] hover:bg-white/70'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.7]" aria-hidden="true">
        <path
          d="M6.5 4.5h9.8a1.7 1.7 0 0 1 1.7 1.7v13.3l-6.6-3.4-6.6 3.4V6.2a1.7 1.7 0 0 1 1.7-1.7Z"
          strokeLinejoin="round"
        />
      </svg>
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}

export function CourseContent({ modules }: { modules: CourseModule[] }) {
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const hasExpandedAll =
    modules.length > 0 && expandedModules.length === modules.length;
  const lessonCount = modules.reduce(
    (count, module) => count + (module.lessons?.length ?? 0),
    0,
  );

  function toggleModule(key: string) {
    setExpandedModules((current) =>
      current.includes(key)
        ? current.filter((moduleKey) => moduleKey !== key)
        : [...current, key],
    );
  }

  function toggleAll() {
    setExpandedModules(
      hasExpandedAll ? [] : modules.map((module) => module._key),
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[10px] border border-[#efe6df] bg-[#fcfaf8]/90">
        {modules.map((module, index) => {
          const isExpanded = expandedModules.includes(module._key);
          const moduleLessons = module.lessons ?? [];
          const moduleDuration = formatDuration(
            moduleLessons.reduce(
              (total, lesson) =>
                total + durationInSeconds(lesson.duration),
              0,
            ),
          );

          return (
            <article
              key={module._key}
              className={index > 0 ? 'border-t border-[#efe9e4]' : ''}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`module-content-${module._key}`}
                  onClick={() => toggleModule(module._key)}
                  className="flex min-h-[66px] w-full items-center gap-3 px-3 text-left transition hover:bg-white/50 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#ed6a45] sm:gap-5 sm:px-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#efe6df] font-display text-[15px]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[13px] leading-tight tracking-[-0.02em] text-[#252321] sm:text-[14px]">
                      {module.title}
                    </span>
                    {module.summary && (
                      <span className="mt-1 block truncate text-[10px] leading-tight text-[#77777d] sm:text-[11px]">
                        {module.summary}
                      </span>
                    )}
                  </span>
                  <span className="hidden shrink-0 text-right text-[11px] text-[#77777d] sm:block">
                    {moduleLessons.length}{' '}
                    {moduleLessons.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                  {moduleDuration && (
                    <span className="w-[48px] shrink-0 text-right text-[11px] text-[#77777d] sm:w-[60px] sm:text-[12px]">
                      {moduleDuration}
                    </span>
                  )}
                  <span className="shrink-0 text-[#666a71]">
                    <Chevron open={isExpanded} />
                  </span>
                </button>
              </h3>
              {isExpanded && (
                <div
                  id={`module-content-${module._key}`}
                  className="border-t border-[#f0e9e4] bg-white/35 px-4 py-2 sm:pl-[68px]"
                >
                  <ul>
                    {moduleLessons.map((lesson) => (
                      <li
                        key={lesson._id}
                        className="flex min-h-10 items-center gap-3 border-b border-[#f1ebe6] py-2 last:border-0"
                      >
                        <span className="min-w-0 flex-1 text-[12px] text-[#383532]">
                          {lesson.title}
                        </span>
                        {lesson.freePreview && (
                          <span className="shrink-0 rounded-full bg-[#fff0ea] px-2 py-1 text-[9px] font-medium text-[#c9502f]">
                            Free preview
                          </span>
                        )}
                        {lesson.duration && (
                          <span className="shrink-0 text-[10px] text-[#77777d]">
                            {formatDuration(durationInSeconds(lesson.duration)) ??
                              lesson.duration}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
        {modules.length === 0 && (
          <p className="px-5 py-6 text-sm text-[#73747b]">
            Course content has not been added yet.
          </p>
        )}
      </div>

      {lessonCount > 0 && (
        <button
          type="button"
          onClick={toggleAll}
          className="absolute left-1/2 top-full z-10 -translate-x-1/2 -translate-y-1/2 rounded-[7px] border border-[#efe6df] bg-[#fcfaf8] px-4 py-2 text-[12px] shadow-[0_2px_6px_rgba(69,42,28,0.03)] transition hover:border-[#e5cfc2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a45]"
        >
          {hasExpandedAll ? 'Hide all lessons' : `Show all ${lessonCount} lessons`}
          <span className="ml-2 inline-block align-middle text-[#73747b]">
            <Chevron open={hasExpandedAll} />
          </span>
        </button>
      )}
    </div>
  );
}
