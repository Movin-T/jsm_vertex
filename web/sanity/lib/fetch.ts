import 'server-only'

import type { QueryParams } from 'next-sanity'

import { client } from './client'

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
  query: string
  params?: QueryParams
  tags?: string[]
  revalidate?: number | false
}): Promise<QueryResult> {
  return client.fetch<QueryResult>(query, params, {
    next: { revalidate, tags },
  })
}
