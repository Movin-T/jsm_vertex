import 'server-only';

import { createMCPClient } from '@ai-sdk/mcp';

import { dataset, projectId } from '../env';

const CONTEXT_API_VERSION = 'v2026-03-03';
const CONTEXT_SLUG = 'vertex-search';

export const mcpUrl =
  process.env.SANITY_CONTEXT_MCP_URL ??
  `https://api.sanity.io/${CONTEXT_API_VERSION}/context/mcp/${projectId}/${dataset}/${CONTEXT_SLUG}`;

function authHeaders() {
  return { Authorization: `Bearer ${process.env.SANITY_API_READ_TOKEN}` };
}

let initialContext: Promise<string> | undefined;

/** Schema and Context-document instructions, fetched once per server process. */
export function getInitialContext() {
  initialContext ??= fetch(`${mcpUrl}/initial-context`, {
    headers: authHeaders(),
    cache: 'no-store',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Initial context request failed (${response.status})`);
      }
      return response.text();
    })
    .catch((error) => {
      initialContext = undefined;
      throw error;
    });
  return initialContext;
}

export function createContextClient() {
  return createMCPClient({
    transport: { type: 'http', url: mcpUrl, headers: authHeaders() },
  });
}
