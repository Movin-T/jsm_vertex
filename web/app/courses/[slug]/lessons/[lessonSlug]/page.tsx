import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PortableText } from '@portabletext/react';

import { SiteHeader } from '@/components/site-header';
import { getLessonBySlug } from '@/sanity/lib/data';
import { durationInSeconds, formatDuration } from '@/sanity/lib/duration';
import { urlFor } from '@/sanity/lib/image';
import { getYouTubeId, youTubeEmbedUrl } from '@/sanity/lib/video';
import {
  LessonBookmark,
  LessonSidebar,
  LessonTabs,
  LessonViewTracker,
  type SidebarModule,
} from './lesson-client';

type LessonPageProps = {
  params: Promise<{ slug: string; lessonSlug: string }>;
  searchParams: Promise<{ t?: string }>;
};

function formatStudentCount(count: number | null | undefined) {
  if (count == null) return null;

  return `${new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(count)} students`;
}

function displayDuration(value: string | number | null | undefined) {
  return formatDuration(durationInSeconds(value));
}

function safeHref(url: string | null | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

function Icon({
  name,
  className = 'h-4 w-4',
}: {
  name:
    | 'clock'
    | 'chart'
    | 'students'
    | 'arrow'
    | 'check'
    | 'bulb'
    | 'doc'
    | 'play'
    | 'download'
    | 'external';
  className?: string;
}) {
  const shared = `${className} fill-none stroke-current stroke-[1.7]`;
  const paths: Record<string, React.ReactNode> = {
    clock: (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <path
          d="M12 8v4.5l3 1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    chart: <path d="M5 18v-4m4 4V9m5 9V5m5 13v-7" strokeLinecap="round" />,
    students: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path
          d="M3 19v-1a6 6 0 0 1 12 0v1H3Zm13-10a3 3 0 1 0 0-6m2 9a5 5 0 0 1 3 4.6v.4h-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    arrow: (
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path
          d="m8.5 12.3 2.4 2.4 4.6-4.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    bulb: (
      <path
        d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    doc: (
      <path
        d="M7 3.5h6.5L18 8v12.5H7V3.5ZM13 3.5V8h5M9.5 12h5m-5 3h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    play: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m10.5 8.8 4.5 3.2-4.5 3.2V8.8Z" strokeLinejoin="round" />
      </>
    ),
    download: (
      <path
        d="M12 4v11m0 0 4-4m-4 4-4-4M5 19.5h14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    external: (
      <path
        d="M14 5h5v5m0-5-8 8M18 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1H10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };

  return (
    <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const RESOURCE_ICON = {
  video: 'play',
  download: 'download',
  file: 'doc',
  link: 'doc',
} as const;

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug, lessonSlug } = await params;
  const lesson = await getLessonBySlug(slug, lessonSlug);

  if (!lesson?.course) return { title: 'Lesson not found | Vertex' };

  return {
    title: `${lesson.title ?? 'Lesson'} | ${lesson.course.title} | Vertex`,
  };
}

export default async function LessonPage({
  params,
  searchParams,
}: LessonPageProps) {
  const [{ slug, lessonSlug }, { t }] = await Promise.all([
    params,
    searchParams,
  ]);
  const lesson = await getLessonBySlug(slug, lessonSlug);

  if (!lesson || !lesson.course) notFound();

  const { course } = lesson;
  const lessonHref = (target: string | undefined) =>
    `/courses/${slug}/lessons/${target ?? ''}`;

  const modules = course.modules ?? [];
  const currentModule =
    lesson.moduleNumber != null ? modules[lesson.moduleNumber - 1] : undefined;

  const sidebarModules: SidebarModule[] = modules.map((module, index) => ({
    key: module._key,
    number: index + 1,
    title: module.title ?? '',
    duration: formatDuration(
      (module.lessons ?? []).reduce(
        (total, entry) => total + durationInSeconds(entry?.duration),
        0,
      ),
    ),
    lessons: (module.lessons ?? []).map((entry) => ({
      id: entry._id,
      title: entry.title ?? '',
      duration: displayDuration(entry.duration),
      href: lessonHref(entry.slug?.current),
      current: entry.slug?.current === lessonSlug,
    })),
  }));

  const startSeconds = /^\d+$/.test(t ?? '') ? Number(t) : 0;
  const videoId = getYouTubeId(lesson.videoUrl);
  const posterUrl = lesson.image?.asset?._ref
    ? urlFor(lesson.image).width(1280).height(720).fit('crop').url()
    : null;
  const markUrl = course.coverImage?.asset?._ref
    ? urlFor(course.coverImage).width(96).height(96).fit('crop').url()
    : null;

  const duration = displayDuration(lesson.duration);
  const studentCount = formatStudentCount(lesson.studentCount);
  const { previousLesson, nextLesson } = lesson;
  const resources = (lesson.resources ?? []).flatMap((resource) => {
    const href = safeHref(resource.url);
    return href ? [{ ...resource, href }] : [];
  });

  const content = (
    <div className="space-y-8">
      {lesson.notes && lesson.notes.length > 0 && (
        <section aria-labelledby="overview-title" className="max-w-[640px]">
          <h2
            id="overview-title"
            className="font-display text-[17px] tracking-[-0.02em]"
          >
            Overview
          </h2>
          <div className="mt-3 space-y-3 text-[13px] leading-[1.7] text-[#686c75] [&_h2]:mt-5 [&_h2]:font-display [&_h2]:text-[15px] [&_h2]:text-[#1d1b1a] [&_h3]:mt-4 [&_h3]:font-display [&_h3]:text-[14px] [&_h3]:text-[#1d1b1a] [&_li]:ml-5 [&_li]:list-disc [&_a]:text-[#d95735] [&_a]:underline">
            <PortableText value={lesson.notes} />
          </div>
        </section>
      )}

      {lesson.keyPoints && lesson.keyPoints.length > 0 && (
        <section
          aria-labelledby="key-points-title"
          className="border-t border-[#eee7e1] pt-6"
        >
          <h2 id="key-points-title" className="text-[13px] text-[#1d1b1a]">
            In this lesson you will:
          </h2>
          <ul className="mt-4 space-y-3.5">
            {lesson.keyPoints.map((point) => (
              <li
                key={point}
                className="flex items-center gap-3 text-[12px] text-[#4b4b52]"
              >
                <Icon
                  name="check"
                  className="h-[17px] w-[17px] shrink-0 text-[#e66a46]"
                />
                {point}
              </li>
            ))}
          </ul>
        </section>
      )}

      {lesson.proTip && (
        <aside className="flex gap-3 rounded-[9px] border border-[#f6dbd0] bg-[#fdefe9] px-5 py-4">
          <Icon
            name="bulb"
            className="mt-0.5 h-5 w-5 shrink-0 text-[#e66a46]"
          />
          <div>
            <p className="text-[12px] font-medium text-[#1d1b1a]">Pro Tip</p>
            <p className="mt-1 text-[11px] leading-[1.7] text-[#686c75]">
              {lesson.proTip}
            </p>
          </div>
        </aside>
      )}

      {resources.length > 0 && (
        <section
          aria-labelledby="resources-title"
          className="border-t border-[#eee7e1] pt-6"
        >
          <h2 id="resources-title" className="text-[13px] text-[#1d1b1a]">
            Resources
          </h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {resources.map((resource) => (
              <li key={resource._key}>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full gap-3 rounded-[9px] border border-[#efe6df] bg-[#fcfaf8]/80 p-4 transition hover:border-[#e5cfc2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a45]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#fdefe9] text-[#e66a46]">
                    <Icon
                      name={RESOURCE_ICON[resource.type ?? 'link']}
                      className="h-4 w-4"
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-medium text-[#1d1b1a]">
                      {resource.title}
                    </span>
                    {resource.description && (
                      <span className="mt-1 block text-[10px] leading-[1.6] text-[#77777d]">
                        {resource.description}
                      </span>
                    )}
                  </span>
                  <Icon
                    name="external"
                    className="h-3.5 w-3.5 shrink-0 text-[#77777d]"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );

  const notesTab = (
    <p className="rounded-[9px] border border-dashed border-[#e9dfd8] px-5 py-8 text-center text-[12px] text-[#77777d]">
      Your notes for this lesson will appear here.
    </p>
  );

  return (
    <div className="vertex-page min-h-screen text-[#1d1b1a]">
      <SiteHeader />
      <LessonViewTracker lessonSlug={lessonSlug} courseSlug={slug} />

      <div className="flex flex-col lg:flex-row">
        <LessonSidebar
          courseHref={`/courses/${slug}`}
          courseTitle={course.title ?? ''}
          currentModuleKey={currentModule?._key}
          modules={sidebarModules}
          mark={
            markUrl ? (
              <Image
                src={markUrl}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 rounded-[6px] object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[#121212] font-display text-[22px] text-white"
              >
                {course.title?.slice(0, 1)}
              </span>
            )
          }
        />

        <main className="min-w-0 flex-1 px-5 pb-32 pt-6 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-[920px]">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#72737a]"
            >
              <Link href="/courses" className="transition hover:text-[#ed6a45]">
                All Courses
              </Link>
              <span aria-hidden="true">›</span>
              <Link
                href={`/courses/${slug}`}
                className="transition hover:text-[#ed6a45]"
              >
                {course.title}
              </Link>
              {currentModule?.title && (
                <>
                  <span aria-hidden="true">›</span>
                  <span>{currentModule.title}</span>
                </>
              )}
              <span aria-hidden="true">›</span>
              <span aria-current="page" className="text-[#515158]">
                {lesson.title}
              </span>
            </nav>

            <div className="mt-6 flex items-start justify-between gap-4">
              <div className="min-w-0">
                {lesson.lessonNumber && (
                  <span className="inline-block rounded-[5px] bg-[#fff0ea] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#df5d39]">
                    Lesson {lesson.lessonNumber}
                  </span>
                )}
                <h1 className="mt-4 font-display text-[32px] leading-[1.1] tracking-[-0.05em] text-[#111] sm:text-[40px]">
                  {lesson.title}
                </h1>
              </div>
              <LessonBookmark />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-[#686c75]">
              {duration && (
                <span className="flex items-center gap-2">
                  <Icon name="clock" className="h-4 w-4" />
                  {duration}
                </span>
              )}
              {course.level && (
                <span className="flex items-center gap-2 capitalize">
                  <Icon name="chart" className="h-4 w-4" />
                  {course.level}
                </span>
              )}
              {studentCount && (
                <span className="flex items-center gap-2">
                  <Icon name="students" className="h-4 w-4" />
                  {studentCount}
                </span>
              )}
            </div>

            <div className="mt-6 overflow-hidden rounded-[12px] bg-black shadow-sm">
              <div className="relative aspect-video">
                {videoId ? (
                  <iframe
                    key={`${videoId}-${startSeconds}`}
                    src={youTubeEmbedUrl(videoId, startSeconds)}
                    title={lesson.title ?? 'Lesson video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 h-full w-full border-0"
                  />
                ) : (
                  <>
                    {posterUrl && (
                      <Image
                        src={posterUrl}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 920px"
                        className="object-cover opacity-60"
                      />
                    )}
                    <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-[13px] text-white">
                      This video format is not supported yet.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8">
              <LessonTabs content={content} notes={notesTab} />
            </div>
          </div>
        </main>
      </div>

      <nav
        aria-label="Lesson navigation"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-[#eee7e1] bg-[#fcfaf8]/95 backdrop-blur"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-4">
            {previousLesson ? (
              <Link
                href={lessonHref(previousLesson.slug?.current)}
                className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-[7px] border border-[#e9dfd8] bg-white/60 px-4 text-[12px] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a45]"
              >
                <span aria-hidden="true">←</span>
                <span className="hidden sm:inline">Previous Lesson</span>
                <span className="sm:hidden">Previous</span>
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center gap-3 rounded-[7px] border border-[#eee7e1] px-4 text-[12px] text-[#b5aeaa]">
                <span aria-hidden="true">←</span>
                <span className="hidden sm:inline">Previous Lesson</span>
                <span className="sm:hidden">Previous</span>
              </span>
            )}
            {previousLesson && (
              <p className="hidden min-w-0 text-[10px] text-[#77777d] md:block">
                <span className="block truncate">{previousLesson.title}</span>
                <span className="block">
                  {displayDuration(previousLesson.duration)}
                </span>
              </p>
            )}
          </div>

          <div className="flex min-w-0 items-center gap-4">
            {nextLesson && (
              <p className="hidden min-w-0 text-right text-[10px] text-[#77777d] md:block">
                <span className="block truncate">{nextLesson.title}</span>
                <span className="block">
                  {displayDuration(nextLesson.duration)}
                </span>
              </p>
            )}
            {nextLesson ? (
              <Link
                href={lessonHref(nextLesson.slug?.current)}
                className="inline-flex min-h-11 shrink-0 items-center gap-4 rounded-[7px] bg-[#e66a46] px-5 text-[12px] font-medium text-white shadow-[0_3px_6px_rgba(195,82,49,0.2)] transition hover:bg-[#d95735] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ed6a45]"
              >
                Next Lesson
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="inline-flex min-h-11 shrink-0 items-center gap-4 rounded-[7px] bg-[#e66a46] px-5 text-[12px] font-medium text-white shadow-[0_3px_6px_rgba(195,82,49,0.2)] transition hover:bg-[#d95735] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ed6a45]"
              >
                Back to course
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
