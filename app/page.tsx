import Link from 'next/link';

const courses = [
  {
    title: 'Next.js for Production',
    description:
      'Build scalable, high-performance web applications with Next.js.',
    level: 'Intermediate',
    duration: '18h 24m',
    modules: '12 modules',
    mark: 'N',
    markClass: 'bg-[#101010] text-white',
  },
  {
    title: 'Docker Essentials',
    description:
      'Containerize applications and streamline your development workflow.',
    level: 'Beginner',
    duration: '10h 12m',
    modules: '8 modules',
    mark: 'docker',
    markClass: 'text-[#1986d7]',
  },
  {
    title: 'TypeScript Deep Dive',
    description: 'Go beyond the basics and write safer, more expressive code.',
    level: 'Intermediate',
    duration: '14h 36m',
    modules: '10 modules',
    mark: 'TS',
    markClass: 'bg-[#397cc9] text-white',
  },
];

/** Renders the decorative Vertex logo used in the page header. */
function BrandMark() {
  return (
    <svg viewBox="0 0 36 36" className="h-8 w-8" aria-hidden="true">
      <path
        d="M4 27.5 17.7 5h5.5L17.8 15.8 30 27.5H24.7L17.5 20l-7.2 7.5H4Z"
        fill="#ed6a45"
      />
      <path
        d="M14.4 29.5 22 6.7h4.4l-7.7 22.8h-4.3Z"
        fill="#1d1a17"
        opacity=".85"
      />
    </svg>
  );
}

/** Renders a decorative interface glyph with optional caller-supplied classes. */
function Icon({
  name,
  className = 'h-4 w-4',
}: {
  name: 'bell' | 'search' | 'arrow' | 'chart' | 'clock' | 'book';
  className?: string;
}) {
  const shared = `${className} fill-none stroke-current stroke-[1.7]`;

  if (name === 'bell') {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
        <path
          d="M18 9.8a6 6 0 0 0-12 0c0 6-2.3 6-2.3 7.5h16.6C20.3 15.8 18 15.8 18 9.8ZM10 20h4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === 'search') {
    return (
      <svg viewBox="0 0 24 24" className={shared} aria-hidden="true">
        <circle cx="10.8" cy="10.8" r="6.2" />
        <path d="m16 16 4.2 4.2" strokeLinecap="round" />
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

/** Renders the Docker logo or a styled text mark for a course. */
function CourseMark({ type, className }: { type: string; className: string }) {
  if (type === 'docker') {
    return (
      <div
        className={`flex h-14 w-14 items-center justify-center ${className}`}
        aria-label="Docker"
      >
        <svg viewBox="0 0 64 52" className="h-11 w-11" aria-hidden="true">
          <path
            d="M4 25h44c3-4 7-4 11-2-1 5-5 8-10 8-3 10-12 16-24 16C13 47 6 39 4 25Z"
            fill="#2496ed"
            stroke="#0d4c86"
            strokeWidth="1.5"
          />
          <path
            d="M13 23h8v-7h-8v7Zm10 0h8v-7h-8v7Zm10 0h8v-7h-8v7ZM18 14h8V7h-8v7Zm10 0h8V7h-8v7Z"
            fill="#2496ed"
            stroke="#0d4c86"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    );
  }
  return (
    <div
      className={`flex h-14 w-14 items-center justify-center rounded-[8px] text-[28px] font-semibold tracking-[-0.08em] ${className}`}
    >
      {type}
    </div>
  );
}

/** Renders a linked course summary with its mark and catalog metadata. */
function CourseCard({ course }: { course: (typeof courses)[number] }) {
  return (
    <Link
      href="#courses"
      className="group flex min-h-[280px] flex-col rounded-[12px] border border-[#e9dfd8] bg-white/60 p-5 transition hover:-translate-y-1 hover:border-[#f3a080] hover:shadow-[0_14px_30px_rgba(82,46,29,0.08)]"
    >
      <CourseMark type={course.mark} className={course.markClass} />
      <h3 className="mt-5 font-display text-[19px] leading-[1.15] tracking-[-0.035em] text-[#1b1917]">
        {course.title}
      </h3>
      <p className="mt-4 max-w-[220px] text-[12px] leading-[1.65] text-[#68717d]">
        {course.description}
      </p>
      <div className="mt-auto flex items-center gap-3 border-t border-[#eee7e1] pt-4 text-[9px] text-[#68717d]">
        <span className="flex items-center gap-1">
          <Icon name="chart" className="h-3.5 w-3.5" />
          {course.level}
        </span>
        <span className="flex items-center gap-1">
          <Icon name="clock" className="h-3.5 w-3.5" />
          {course.duration}
        </span>
        <span className="flex items-center gap-1">
          <Icon name="book" className="h-3.5 w-3.5" />
          {course.modules}
        </span>
      </div>
    </Link>
  );
}

/** Renders the Vertex landing page and its static course catalog. */
export default function Home() {
  return (
    <main className="vertex-page min-h-screen overflow-hidden text-[#1d1b1a]">
      <header className="border-b border-[#eee7e1] bg-[#fcfaf8]/90">
        <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-6 px-6 md:px-10">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="Vertex home"
          >
            <BrandMark />
            <span className="text-[18px] font-semibold tracking-[-0.05em]">
              Vertex
            </span>
          </Link>
          <nav
            className="mr-auto flex items-center gap-8 pl-8 text-[12px] font-medium text-[#1e1b19]"
            aria-label="Primary navigation"
          >
            <Link href="#courses" className="transition hover:text-[#ed6a45]">
              Courses
            </Link>
            <Link href="#learning" className="transition hover:text-[#ed6a45]">
              My Learning
            </Link>
          </nav>
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="rounded-full p-1.5 text-[#4b4a49] transition hover:bg-[#f4e9e2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a45]"
              aria-label="Notifications"
            >
              <Icon name="bell" className="h-5 w-5" />
            </button>
            <div className="avatar-mark" aria-label="Account profile">
              AM
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto flex max-w-[1440px] flex-col items-center px-6 pb-10 pt-12 text-center md:pt-[51px]">
        <span className="rounded-[6px] border border-[#f3e2da] bg-[#fffaf7] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#e86440]">
          Intelligent learning
        </span>
        <h1 className="mt-7 max-w-[600px] font-display text-[46px] leading-[1.06] tracking-[-0.06em] text-[#111111] md:text-[52px]">
          Search your learning
          <br />
          in plain English.
        </h1>
        <p className="mt-5 max-w-[430px] text-[16px] leading-[1.55] text-[#69727e]">
          Vertex understands what you want to learn and finds the exact lessons
          across all your courses.
        </p>
        <Link
          href="#courses"
          className="mt-7 inline-flex items-center gap-5 rounded-[7px] bg-[#ed6a45] px-[18px] py-[13px] text-[14px] font-medium text-white shadow-[0_5px_10px_rgba(237,106,69,0.25)] transition hover:bg-[#d95735] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ed6a45]"
        >
          Explore Courses <Icon name="arrow" className="h-4 w-4" />
        </Link>
        <form
          className="mt-8 flex w-full max-w-[560px] items-center gap-3 rounded-[9px] border border-[#eee2da] bg-white/70 px-4 py-3.5 text-left shadow-[0_3px_12px_rgba(64,37,22,0.04)]"
          action="#courses"
        >
          <label htmlFor="learning-search" className="sr-only">
            Search your learning
          </label>
          <Icon name="search" className="h-6 w-6 shrink-0 text-[#45494e]" />
          <input
            id="learning-search"
            type="search"
            placeholder="Ask anything about your learning..."
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[#31363c] outline-none placeholder:text-[#9aa0aa]"
          />
          <kbd className="hidden rounded-[6px] border border-[#eee2da] bg-[#fffdfb] px-2.5 py-2 text-[12px] text-[#60656b] sm:block">
            ⌘ K
          </kbd>
        </form>
      </section>

      <section id="courses" className="border-t border-[#eee7e1]">
        <div className="mx-auto max-w-[1440px] px-6 pb-10 pt-9 md:px-10 md:pt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-display text-[23px] tracking-[-0.04em]">
              All Courses
            </h2>
            <Link
              href="#courses"
              className="flex items-center gap-2 text-[12px] font-medium text-[#ed6a45] hover:text-[#c64f32]"
            >
              View all courses <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course.title} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section
        id="learning"
        className="relative border-t border-[#eee7e1] pt-8"
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-5 px-6 text-center md:px-10">
          <span className="hidden h-px flex-1 bg-[#eee3dc] sm:block" />
          <span className="text-[12px] text-[#626a73]">
            <span className="mr-4 text-[22px] text-[#ed6a45]">☆</span>New
            courses and lessons added every week.
          </span>
          <span className="hidden h-px flex-1 bg-[#eee3dc] sm:block" />
        </div>
        <div className="coral-bars mt-7 h-[130px]" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}
