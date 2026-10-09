'use client';

import Link from 'next/link';
import posthog from 'posthog-js';
import { useEffect, useState, type ReactNode } from 'react';

export function LessonViewTracker({
  lessonSlug,
  courseSlug,
}: {
  lessonSlug: string;
  courseSlug: string;
}) {
  useEffect(() => {
    posthog.capture('lesson_viewed', {
      lesson_slug: lessonSlug,
      course_slug: courseSlug,
    });
  }, [lessonSlug, courseSlug]);

  return null;
}

export function LessonBookmark() {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={bookmarked}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
      onClick={() => {
        setBookmarked(!bookmarked);
        posthog.capture('lesson_bookmark_toggled', { bookmarked: !bookmarked });
      }}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border transition focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ed6a45] ${
        bookmarked
          ? 'border-[#e66a46] bg-[#fff0ea] text-[#c9502f]'
          : 'border-[#e9dfd8] text-[#e66a46] hover:bg-white/70'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-[18px] w-[18px] stroke-current stroke-[1.7] ${bookmarked ? 'fill-current' : 'fill-none'}`}
        aria-hidden="true"
      >
        <path
          d="M6.5 4.5h9.8a1.7 1.7 0 0 1 1.7 1.7v13.3l-6.6-3.4-6.6 3.4V6.2a1.7 1.7 0 0 1 1.7-1.7Z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

const TABS = [
  { id: 'content', label: 'Lesson Content' },
  { id: 'notes', label: 'Notes' },
] as const;

export function LessonTabs({
  content,
  notes,
}: {
  content: ReactNode;
  notes: ReactNode;
}) {
  const [active, setActive] = useState<(typeof TABS)[number]['id']>('content');

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    const next =
      (index + (event.key === 'ArrowRight' ? 1 : -1) + TABS.length) %
      TABS.length;
    setActive(TABS[next].id);
    document.getElementById(`lesson-tab-${TABS[next].id}`)?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Lesson sections"
        className="flex gap-8 border-b border-[#eee7e1]"
      >
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            id={`lesson-tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`lesson-panel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={`-mb-px border-b-2 pb-3 text-[13px] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a45] ${
              active === tab.id
                ? 'border-[#ed6a45] text-[#d95735]'
                : 'border-transparent text-[#686c75] hover:text-[#1d1b1a]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`lesson-panel-${active}`}
        aria-labelledby={`lesson-tab-${active}`}
        className="pt-6"
      >
        {active === 'content' ? content : notes}
      </div>
    </div>
  );
}

export type SidebarModule = {
  key: string;
  number: number;
  title: string;
  duration: string | null;
  lessons: {
    id: string;
    title: string;
    duration: string | null;
    href: string;
    current: boolean;
  }[];
};

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

export function LessonSidebar({
  courseHref,
  courseTitle,
  mark,
  modules,
  currentModuleKey,
}: {
  courseHref: string;
  courseTitle: string;
  mark: ReactNode;
  modules: SidebarModule[];
  currentModuleKey: string | undefined;
}) {
  const [open, setOpen] = useState<string[]>(
    currentModuleKey ? [currentModuleKey] : [],
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const currentNumber = modules.find((m) => m.key === currentModuleKey)?.number;

  function toggle(key: string) {
    setOpen((current) =>
      current.includes(key)
        ? current.filter((entry) => entry !== key)
        : [...current, key],
    );
  }

  return (
    <aside
      aria-label="Course navigation"
      className="border-b border-[#eee7e1] bg-[#fcfaf8]/80 lg:w-[300px] lg:shrink-0 lg:border-b-0 lg:border-r"
    >
      <div className="px-5 py-5 lg:px-6">
        <Link
          href={courseHref}
          className="inline-flex items-center gap-2 text-[12px] text-[#e66a46] transition hover:text-[#c64f32]"
        >
          <span aria-hidden="true">←</span> Back to course
        </Link>
        <div className="mt-5 flex items-center gap-3">
          {mark}
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[14px] text-[#1d1b1a]">
              {courseTitle}
            </p>
            <div
              className="mt-2 h-[3px] rounded-full bg-[#e8e2df]"
              aria-hidden="true"
            />
          </div>
        </div>
        <button
          type="button"
          aria-expanded={panelOpen}
          aria-controls="lesson-sidebar-list"
          onClick={() => setPanelOpen(!panelOpen)}
          className="mt-4 flex w-full items-center justify-between rounded-[7px] border border-[#efe6df] px-3 py-2 text-[12px] lg:hidden"
        >
          Course content
          <Chevron open={panelOpen} />
        </button>
      </div>

      <div
        id="lesson-sidebar-list"
        className={`${panelOpen ? 'block' : 'hidden'} lg:block`}
      >
        <div className="flex items-center justify-between border-y border-[#efe6df] px-5 py-3 text-[12px] text-[#1d1b1a] lg:px-6">
          <span>
            {currentNumber
              ? `Module ${currentNumber} of ${modules.length}`
              : `${modules.length} modules`}
          </span>
        </div>
        <ol>
          {modules.map((module) => {
            const isOpen = open.includes(module.key);
            const isCurrent = module.key === currentModuleKey;

            return (
              <li
                key={module.key}
                className={`border-b border-[#efe9e4] ${isCurrent ? 'bg-[#fdf3ee]/70' : ''}`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`sidebar-module-${module.key}`}
                  onClick={() => toggle(module.key)}
                  className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-white/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ed6a45] lg:px-6"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] ${
                      isCurrent
                        ? 'border-[#e66a46] bg-[#e66a46] text-white'
                        : 'border-[#e9dfd8] text-[#1d1b1a]'
                    }`}
                  >
                    {module.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-medium text-[#1d1b1a]">
                      {module.title}
                    </span>
                    {module.duration && (
                      <span className="mt-0.5 block text-[11px] text-[#77777d]">
                        {module.duration}
                      </span>
                    )}
                  </span>
                  <span className="text-[#666a71]">
                    <Chevron open={isOpen} />
                  </span>
                </button>
                {isOpen && (
                  <ul
                    id={`sidebar-module-${module.key}`}
                    className="pb-3 pl-[56px] pr-5 lg:pr-6"
                  >
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <Link
                          href={lesson.href}
                          aria-current={lesson.current ? 'page' : undefined}
                          className="flex items-start gap-3 py-2 text-[11px] transition hover:text-[#d95735]"
                        >
                          <span
                            aria-hidden="true"
                            className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${lesson.current ? 'bg-[#e66a46]' : 'border border-[#cfc6bf]'}`}
                          />
                          <span className="min-w-0 flex-1">
                            <span
                              className={`block ${lesson.current ? 'font-medium text-[#1d1b1a]' : 'text-[#4b4b52]'}`}
                            >
                              {lesson.title}
                            </span>
                            {lesson.current ? (
                              <span className="block text-[#e66a46]">
                                Now playing
                              </span>
                            ) : (
                              lesson.duration && (
                                <span className="block text-[#77777d]">
                                  {lesson.duration}
                                </span>
                              )
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}
