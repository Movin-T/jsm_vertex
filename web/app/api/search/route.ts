import { NextResponse } from 'next/server';

import { runSearch } from '@/sanity/search/run-search';
import { searchRequestSchema } from '@/sanity/search/schema';

export const maxDuration = 60;

/** Server-side search: LLM over the Sanity Context MCP, hydrated from Sanity by id. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = searchRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Query must be 2 to 200 characters' },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await runSearch(parsed.data.query));
  } catch (error) {
    console.error('Search failed', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
