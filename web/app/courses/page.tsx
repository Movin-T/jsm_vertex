import Image from 'next/image';
import Link from 'next/link';

import { SiteHeader } from '@/components/site-header';
import { getCourses } from '@/sanity/lib/data';
import { durationInSeconds, formatDuration } from '@/sanity/lib/duration';
import { urlFor } from '@/sanity/lib/image';

type Course = Awaited<ReturnType<typeof getCourses>>[number];

const MARK_PALETTE = [
  'bg-[#101010] text-white',
  'bg-[#397cc9] text-white',
  'bg-[#ed6a45] text-white',
  'bg-[#2f6f4f] text-white',
];

/** Derives a short text mark (e.g. "RA" from "React Advanced") for courses without a cover image. */
function initialsFor(title: string) {
  const words = title.split(/\s+/).filter(Boolean);
  return (words[0]?.[0] ?? '').concat(words[1]?.[0] ?? '').toUpperCase();
}

/** Picks a stable palette color for a course's text mark based on its id. */
function markClassFor(id: string) {
  const index = id
    .split('')
    .reduce((total, char) => total + char.charCodeAt(0), 0);
  return MARK_PALETTE[index % MARK_PALETTE.length];
}

/** Renders a decorative interface glyph with optional caller-supplied classes. */
function Icon({
  name,
  className = 'h-4 w-4',
}: {
  name: 'chart' | 'clock' | 'book';
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
  return (
    <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
      <path
        d="M6.5 4.5h9.8a1.7 1.7 0 0 1 1.7 1.7v13.3l-6.6-3.4-6.6 3.4V6.2a1.7 1.7 0 0 1 1.7-1.7Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Renders a course's cover image thumbnail, or a styled text mark when no image is set. */
function CourseMark({ course }: { course: Course }) {
  if (course.coverImage?.asset?._ref) {
    return (
      <Image
        src={urlFor(course.coverImage).width(112).height(112).fit('crop').url()}
        alt=""
        width={56}
        height={56}
        className="h-14 w-14 rounded-[8px] object-cover"
      />
    );
  }
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-[8px] text-[28px] font-semibold tracking-[-0.08em] ${markClassFor(course._id)}`}
    >
      {initialsFor(course.title ?? '')}
    </div>
  );
}

/** Renders a linked course summary with its mark and catalog metadata. */
function CourseCard({ course }: { course: Course }) {
  const totalDuration = formatDuration(
    (course.lessonDurations ?? []).reduce(
      (total, duration) => total + durationInSeconds(duration),
      0,
    ),
  );
  const level = course.level
    ? course.level.charAt(0).toUpperCase() + course.level.slice(1)
    : null;

  return (
    <Link
      href={`/courses/${course.slug?.current ?? ''}`}
      className="group flex min-h-[280px] flex-col rounded-[12px] border border-[#e9dfd8] bg-white/60 p-5 transition hover:-translate-y-1 hover:border-[#f3a080] hover:shadow-[0_14px_30px_rgba(82,46,29,0.08)]"
    >
      <CourseMark course={course} />
      <h3 className="mt-5 font-display text-[19px] leading-[1.15] tracking-[-0.035em] text-[#1b1917]">
        {course.title}
      </h3>
      <p className="mt-4 max-w-[220px] text-[12px] leading-[1.65] text-[#68717d]">
        {course.summary}
      </p>
      <div className="mt-auto flex items-center gap-3 border-t border-[#eee7e1] pt-4 text-[9px] text-[#68717d]">
        {level && (
          <span className="flex items-center gap-1">
            <Icon name="chart" className="h-3.5 w-3.5" />
            {level}
          </span>
        )}
        {totalDuration && (
          <span className="flex items-center gap-1">
            <Icon name="clock" className="h-3.5 w-3.5" />
            {totalDuration}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Icon name="book" className="h-3.5 w-3.5" />
          {course.moduleCount ?? 0} modules
        </span>
      </div>
    </Link>
  );
}

/** Renders the full catalog of Sanity-backed courses. */
export default async function AllCoursesPage() {
  const courses = await getCourses();

  return (
    <main className="vertex-page min-h-screen overflow-hidden text-[#1d1b1a]">
      <SiteHeader />

      <section className="border-t border-[#eee7e1]">
        <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-9 md:px-10 md:pt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="mb-2 text-[12px] text-[#8a8580]"
              >
                <Link href="/" className="hover:text-[#ed6a45]">
                  Home
                </Link>
                <span className="mx-2">›</span>
                <span>All Courses</span>
              </nav>
              <h1 className="font-display text-[23px] tracking-[-0.04em]">
                All Courses
              </h1>
            </div>
            <p className="text-[12px] text-[#68717d]">
              {courses.length} course{courses.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
