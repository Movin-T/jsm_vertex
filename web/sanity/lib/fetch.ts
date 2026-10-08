import 'server-only';

import type { QueryParams } from 'next-sanity';

import { client } from './client';
import { logContentFetch } from './posthog-logger';

/**
 * Server-only fetch helper. No live/browser client is exposed here since
 * that would require shipping the read token to the browser bundle.
 */
export async function sanityFetch<QueryResult>({
  query,
  params = {},
  tags = [],
  revalidate = tags.length ? false : 60,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}): Promise<QueryResult> {
  const startedAt = Date.now();

  try {
    const result = await client.fetch<QueryResult>(query, params, {
      next: { revalidate, tags },
    });
    await logContentFetch({
      durationMs: Date.now() - startedAt,
      tagCount: tags.length,
      hasParams: Object.keys(params).length > 0,
      status: 'success',
    });
    return result;
  } catch (error) {
    await logContentFetch({
      durationMs: Date.now() - startedAt,
      tagCount: tags.length,
      hasParams: Object.keys(params).length > 0,
      status: 'error',
      errorType: error instanceof Error ? error.name : 'unknown',
    });
    throw error;
  }
}
