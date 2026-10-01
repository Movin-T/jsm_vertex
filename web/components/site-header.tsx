import Link from 'next/link';
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';

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

/** Renders the bell glyph used by the notifications button. */
function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current stroke-[1.7]"
      aria-hidden="true"
    >
      <path
        d="M18 9.8a6 6 0 0 0-12 0c0 6-2.3 6-2.3 7.5h16.6C20.3 15.8 18 15.8 18 9.8ZM10 20h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Renders the shared Vertex header (brand, primary nav, and auth controls) used across all pages. */
export function SiteHeader() {
  return (
    <header className="border-b border-[#eee7e1] bg-[#fcfaf8]/90">
      <div className="mx-auto grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-5 py-4 md:flex md:min-h-[72px] md:justify-between md:gap-6 md:px-10 md:py-0">
        <Link
          href="/"
          className="col-start-1 row-start-1 flex items-center gap-2.5 md:col-auto md:row-auto"
          aria-label="Vertex home"
        >
          <BrandMark />
          <span className="text-[18px] font-semibold tracking-[-0.05em]">
            Vertex
          </span>
        </Link>
        <nav
          className="col-span-2 row-start-2 mr-auto flex items-center gap-8 pl-0 text-[12px] font-medium text-[#1e1b19] md:col-auto md:row-auto md:pl-8"
          aria-label="Primary navigation"
        >
          <Link href="/courses" className="transition hover:text-[#ed6a45]">
            Courses
          </Link>
          <Link href="/#learning" className="transition hover:text-[#ed6a45]">
            My Learning
          </Link>
        </nav>
        <div className="col-start-2 row-start-1 flex items-center gap-5 md:col-auto md:row-auto">
          <button
            type="button"
            className="rounded-full p-1.5 text-[#4b4a49] transition hover:bg-[#f4e9e2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed6a45]"
            aria-label="Notifications"
          >
            <BellIcon />
          </button>
          <div aria-label="Account profile">
            <Show when="signed-out">
              <div className="flex items-center gap-3 text-[12px] font-medium">
                <SignInButton>
                  <button
                    type="button"
                    className="rounded-full px-3 py-1.5 transition hover:text-[#ed6a45]"
                  >
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button
                    type="button"
                    className="rounded-full bg-[#ed6a45] px-3.5 py-1.5 text-white transition hover:bg-[#e15a33]"
                  >
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
}
