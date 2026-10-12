import { SiteHeader } from '@/components/site-header';

import { SearchResults } from './search-results';

export const metadata = { title: 'Search | Vertex' };

/** Search results page; the query comes from the `q` URL param. */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 200) ?? '';

  return (
    <main className="vertex-page min-h-screen overflow-hidden text-[#1d1b1a]">
      <SiteHeader />
      <SearchResults key={query} query={query} />
    </main>
  );
}
