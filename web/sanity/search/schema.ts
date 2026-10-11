import 'server-only';

import { z } from 'zod';

export const MAX_RESULTS = 30;

export const searchRequestSchema = z.object({
  query: z.string().trim().min(2).max(200),
});

/** The model returns ids only; every displayed field is hydrated from Sanity. */
export const modelOutputSchema = z.object({
  results: z
    .array(
      z.object({
        kind: z.enum(['video', 'lesson']),
        lessonId: z.string(),
        matchedSeconds: z.number().int().min(0).nullable(),
      }),
    )
    .max(MAX_RESULTS),
});

export type ModelResult = z.infer<typeof modelOutputSchema>['results'][number];
