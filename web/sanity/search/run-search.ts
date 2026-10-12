import 'server-only';

import { openai } from '@ai-sdk/openai';
import { generateText, Output, stepCountIs } from 'ai';

import { hydrateResults } from './hydrate';
import { createContextClient, getInitialContext } from './mcp';
import { buildSystemPrompt } from './prompt';
import { modelOutputSchema } from './schema';
import type { SearchResponse } from './types';

const MODEL = process.env.OPENAI_MODEL ?? 'gpt-5-mini';

/** Runs the LLM over the Context MCP, then hydrates the returned ids from Sanity. */
export async function runSearch(query: string): Promise<SearchResponse> {
  const [initialContext, mcp] = await Promise.all([
    getInitialContext(),
    createContextClient(),
  ]);

  try {
    const allTools = await mcp.tools();
    const tools = Object.fromEntries(
      Object.entries(allTools).filter(([name]) => name !== 'initial_context'),
    );

    const { output } = await generateText({
      model: openai(MODEL),
      system: buildSystemPrompt(initialContext),
      prompt: query,
      tools,
      output: Output.object({ schema: modelOutputSchema }),
      stopWhen: stepCountIs(8),
      abortSignal: AbortSignal.timeout(55_000),
    });

    return await hydrateResults(output.results, query);
  } finally {
    await mcp.close();
  }
}
