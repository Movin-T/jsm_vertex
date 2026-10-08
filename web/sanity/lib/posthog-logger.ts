import 'server-only';

import { SeverityNumber } from '@opentelemetry/api-logs';
import { loggerProvider } from '../../instrumentation';

const logger = loggerProvider?.getLogger('vertex-content-data');

type ContentFetchLog = {
  durationMs: number;
  tagCount: number;
  hasParams: boolean;
  status: 'success' | 'error';
  errorType?: string;
};

export async function logContentFetch({
  durationMs,
  tagCount,
  hasParams,
  status,
  errorType,
}: ContentFetchLog) {
  if (!logger || !loggerProvider) return;

  try {
    logger.emit({
      body: 'Sanity content fetch completed',
      severityNumber:
        status === 'error' ? SeverityNumber.ERROR : SeverityNumber.INFO,
      attributes: {
        event: 'sanity_content_fetch',
        duration_ms: durationMs,
        tag_count: tagCount,
        has_params: hasParams,
        status,
        ...(errorType ? { error_type: errorType } : {}),
      },
    });
    await loggerProvider.forceFlush();
  } catch {
    // Logging must not change the outcome of the application request.
  }
}
