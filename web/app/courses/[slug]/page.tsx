import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { getCourseBySlug } from '@/sanity/lib/data';
import { durationInSeconds, formatDuration } from '@/sanity/lib/duration';
import { urlFor } from '@/sanity/lib/image';
import { BookmarkButton, CourseContent } from './course-content';

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

function formatStudentCount(count: number | null | undefined) {
  if (count == null) return null;

  return `${new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(count)} students`;
}

function Icon({
  name,
  className = 'h-4 w-4',
}: {
  name: 'chart' | 'clock' | 'book' | 'students' | 'arrow' | 'bookmark';
  className?: string;
}) {
  const shared = `${className} fill-none stroke-current stroke-[1.7]`;

  if (name === 'chart') {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
        <path d="M5 18v-4m4 4V9m5 9V5m5 13v-7" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" />
        <path
          d="M12 8v4.5l3 1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === 'book') {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
        <path
          d="M5 5.5h10.5a2 2 0 0 1 2 2V20H7a2 2 0 0 1-2-2V5.5Zm0 12.5a2 2 0 0 1 2-2h10.5M9 9h5m-5 3h5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === 'students') {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" />
        <path
          d="M3 19v-1a6 6 0 0 1 12 0v1H3Zm13-10a3 3 0 1 0 0-6m2 9a5 5 0 0 1 3 4.6v.4h-3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === 'arrow') {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
        <path
          d="M4 12h15m-6-6 6 6-6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === 'bookmark') {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
        <path
          d="M6.5 4.5h9.8a1.7 1.7 0 0 1 1.7 1.7v13.3l-6.6-3.4-6.6 3.4V6.2a1.7 1.7 0 0 1 1.7-1.7Z"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
      <path d="M5 18v-4m5 4V9m5 9V5m5 13v-7" strokeLinecap="round" />
    </svg>
  );
}

function OutcomeIcon({ icon }: { icon: string | null | undefined }) {
  const shared = 'h-10 w-10 shrink-0 fill-none stroke-current stroke-[1.3]';

  if (icon === 'layers') {
    return (
      <svg viewBox="0 0 40 40" className={shared} aria-hidden="true">
        <path d="m20 5 15 8-15 8-15-8 15-8Zm-15 14 15 8 15-8M5 27l15 8 15-8" />
      </svg>
    );
  }

  if (icon === 'workflow') {
    return (
      <svg viewBox="0 0 40 40" className={shared} aria-hidden="true">
        <circle cx="9" cy="20" r="4" />
        <circle cx="31" cy="10" r="4" />
        <circle cx="31" cy="30" r="4" />
        <path d="M13 20h8m0 0V10h6m-6 10v10h6" />
      </svg>
    );
  }

  if (icon === 'gauge') {
    return (
      <svg viewBox="0 0 40 40" className={shared} aria-hidden="true">
        <path d="M6 30a15 15 0 1 1 28 0M20 21l8-8" />
        <circle cx="20" cy="21" r="2" />
        <path d="M10 24h2m16 0h2M20 8v2" />
      </svg>
    );
  }

  if (icon === 'rocket') {
    return (
      <svg viewBox="0 0 40 40" className={shared} aria-hidden="true">
        <path d="M23 8c4-4 9-4 9-4s0 5-4 9l-9 9-6-6 10-8Z" />
        <path d="m13 17-5 1-4 5 9 1m5-5-1 5-5 4-1-9m12-9h.1M12 28l-4 4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" className={shared} aria-hidden="true">
      <path d="m20 5 15 8-15 8-15-8 15-8Zm-15 14 15 8 15-8" />
    </svg>
  );
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) return { title: 'Course not found | Vertex' };

  return {
    title: `${course.title ?? 'Course'} | Vertex`,
    description: course.summary ?? undefined,
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  const modules = course.modules ?? [];
  const lessons = modules.flatMap((module) => module.lessons ?? []);
  const totalDuration = formatDuration(
    lessons.reduce(
      (total, lesson) => total + durationInSeconds(lesson.duration),
      0,
    ),
  );
  const studentCount = formatStudentCount(course.studentCount);
  const coverImageUrl = course.coverImage?.asset?._ref
    ? urlFor(course.coverImage).width(720).height(720).fit('crop').url()
    : null;

  return (
    <main className="vertex-page min-h-screen overflow-x-clip pb-28 text-[#1d1b1a]">
      <SiteHeader />

      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-3 py-5 text-[12px] text-[#72737a] sm:py-6"
        >
          <Link href="/courses" className="transition hover:text-[#ed6a45]">
            All Courses
          </Link>
          <span aria-hidden="true" className="text-[17px] leading-none">
            ›
          </span>
          <span aria-current="page" className="truncate text-[#515158]">
            {course.title}
          </span>
        </nav>

        <section
          aria-labelledby="course-title"
          className="grid gap-7 pb-8 sm:grid-cols-[minmax(200px,280px)_1fr] sm:gap-10 sm:pb-10"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-[#121212] shadow-sm">
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={
                  course.title ? `${course.title} course cover` : 'Course cover'
                }
                fill
                priority
                sizes="(max-width: 639px) 100vw, 280px"
                className="object-cover"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center font-display text-[150px] text-white"
                aria-hidden="true"
              >
                {course.title?.slice(0, 1) ?? 'V'}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {course.popular && (
              <span className="mb-4 w-fit rounded-[6px] bg-[#fff0ea] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#df5d39]">
                Popular
              </span>
            )}
            <h1
              id="course-title"
              className="font-display text-[35px] leading-[1.08] tracking-[-0.055em] text-[#111] sm:text-[42px] lg:text-[48px]"
            >
              {course.title}
            </h1>
            {course.summary && (
              <p className="mt-4 max-w-[610px] text-[16px] leading-[1.65] text-[#686c75] sm:text-[17px]">
                {course.summary}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-[#686c75]">
              {course.level && (
                <span className="flex items-center gap-2">
                  <Icon name="chart" className="h-4 w-4" />
                  <span className="capitalize">{course.level}</span>
                </span>
              )}
              {totalDuration && (
                <span className="flex items-center gap-2">
                  <Icon name="clock" className="h-4 w-4" />
                  {totalDuration}
                </span>
              )}
              <span className="flex items-center gap-2">
                <Icon name="book" className="h-4 w-4" />
                {modules.length} {modules.length === 1 ? 'module' : 'modules'}
              </span>
              {studentCount && (
                <span className="flex items-center gap-2">
                  <Icon name="students" className="h-4 w-4" />
                  {studentCount}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#course-content"
                className="inline-flex min-h-11 items-center justify-center gap-5 rounded-[7px] bg-[#e66a46] px-5 text-[13px] font-medium text-white shadow-[0_3px_6px_rgba(195,82,49,0.2)] transition hover:bg-[#d95735] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ed6a45]"
              >
                Continue Learning
                <Icon name="arrow" className="h-4 w-4" />
              </a>
              <BookmarkButton />
            </div>
          </div>
        </section>

        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <section
            aria-labelledby="outcomes-title"
            className="rounded-[10px] border border-[#efe6df] bg-[#fcfaf8]/85 px-5 py-6 sm:px-7 sm:py-7"
          >
            <h2
              id="outcomes-title"
              className="font-display text-[21px] tracking-[-0.04em] sm:text-[23px]"
            >
              What you’ll learn
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
              {course.learningOutcomes.map((outcome) => (
                <li
                  key={outcome._key}
                  className="flex min-h-[112px] items-center gap-5 rounded-[9px] border border-[#efe6df] px-5 py-4 sm:gap-7 sm:px-6"
                >
                  <span className="text-[#e9633d]">
                    <OutcomeIcon icon={outcome.icon} />
                  </span>
                  <div>
                    {outcome.title && (
                      <h3 className="font-display text-[16px] leading-snug tracking-[-0.025em] sm:text-[17px]">
                        {outcome.title}
                      </h3>
                    )}
                    {outcome.description && (
                      <p className="mt-1.5 text-[12px] leading-[1.65] text-[#73747b] sm:text-[13px]">
                        {outcome.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section id="course-content" className="scroll-mt-6 pb-8 pt-7 sm:pt-8">
          <div className="mb-3 flex items-end justify-between gap-4 px-1">
            <h2 className="font-display text-[21px] tracking-[-0.04em] sm:text-[23px]">
              Course Content
            </h2>
            <p className="shrink-0 text-[11px] text-[#73747b] sm:text-[12px]">
              {modules.length} {modules.length === 1 ? 'module' : 'modules'}
              {totalDuration && (
                <>
                  <span aria-hidden="true" className="mx-2">
                    •
                  </span>
                  {totalDuration}
                </>
              )}
            </p>
          </div>
          <CourseContent modules={modules} />
        </section>
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-16"
        aria-hidden="true"
      >
        <div className="coral-bars h-full">
          {Array.from({ length: 15 }, (_, index) => (
            <span key={index} />
          ))}
        </div>
      </div>

      <aside
        aria-label="Course progress"
        className="fixed inset-x-3 bottom-3 z-20 mx-auto flex max-w-[1080px] items-center justify-between gap-4 rounded-[10px] border border-[#efe3db] bg-[#fcfaf8]/95 px-4 py-3 shadow-[0_8px_26px_rgba(69,42,28,0.12)] backdrop-blur sm:inset-x-6 sm:px-6"
      >
        <div className="min-w-0">
          <p className="text-[10px] text-[#7a7a80] sm:text-[11px]">
            Your Progress
          </p>
          <p className="mt-1 text-[11px] text-[#7a7a80] sm:text-[12px]">
            Progress will appear as you learn
          </p>
        </div>
        <div className="hidden flex-1 px-3 sm:block">
          <div className="h-[6px] rounded-full bg-[#e8e2df]" />
        </div>
        <a
          href="#course-content"
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-4 rounded-[7px] bg-[#e66a46] px-4 text-[12px] font-medium text-white shadow-[0_3px_6px_rgba(195,82,49,0.2)] transition hover:bg-[#d95735] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ed6a45] sm:min-h-11 sm:px-6 sm:text-[13px]"
        >
          Continue Learning
          <Icon name="arrow" className="h-4 w-4" />
        </a>
      </aside>
    </main>
  );
}
