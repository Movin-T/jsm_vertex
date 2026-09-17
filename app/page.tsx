import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f0ea] px-6 py-10 text-[#1f1b19]">
      <div className="w-full max-w-xl rounded-[24px] border border-[#d8d1ca] bg-[#fffdfb] p-8 shadow-[0_20px_40px_rgba(27,24,23,0.06)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a726a]">
          Vertex
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#1d1a18]">
          Design system
        </h1>
        <p className="mt-3 text-base leading-7 text-[#5e5752]">
          The system reference lives on a dedicated route for easy review and
          iteration.
        </p>
        <Link
          href="/design-system"
          className="mt-6 inline-flex items-center justify-center rounded-[12px] bg-[#f97316] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(249,115,22,0.25)] transition hover:bg-[#ea6d0e]"
        >
          Open design system
        </Link>
      </div>
    </main>
  );
}
