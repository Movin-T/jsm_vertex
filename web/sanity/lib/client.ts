import 'server-only'

import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

/**
 * Server-only client. Reads the private dataset with a read token that
 * must never reach the browser bundle.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
})
