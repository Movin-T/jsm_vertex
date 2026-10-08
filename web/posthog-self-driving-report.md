# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for this web learning catalog. Session Replay, Error Tracking, and Support are enabled; health, error, and support signal sources are active; and two Replay Vision monitors feed verified visual defects into the inbox.

Fresh scout configurations are picked up within about 30 minutes. Findings will begin appearing in the [Self-driving inbox](https://us.posthog.com/project/599958/inbox) as data arrives and corroborates.

## AI data processing

**Approved.**

## GitHub

**Connected before this setup.** The existing PostHog GitHub App connection was retained; no GitHub Issues responder was enabled because no connected tools were selected.

## Products enabled

| Product | Status | Notes |
|---|---|---|
| Session Replay | Enabled | The `posthog-js` initialization does not disable recording. There are no recordings yet. |
| Error Tracking | Enabled | Client initialization has `capture_exceptions: true`; no override was needed. |
| Support (Conversations) | Enabled | Tickets will flow after an inbound email, inbox, or Slack channel is connected in PostHog. |

## Signal sources

| Source product | Source type | Action |
|---|---|---|
| `signals_scout` | `cross_source_issue` | On by default; no opt-out row was created. |
| `health_checks` | `health_issue` | Enabled (source id `01a11c58-5858-791d-af45-3b0a29a88170`). |
| `error_tracking` | `issue_created` | Enabled (source id `01a11c58-5850-7527-8151-bf1ebf0c23db`). |
| `error_tracking` | `issue_reopened` | Enabled (source id `01a11c58-5869-78b9-8dbb-759c4a02fbc8`). |
| `error_tracking` | `issue_spiking` | Enabled (source id `01a11c58-5842-7dfc-91b4-a191771f7433`). |
| `conversations` | `ticket` | Enabled (source id `01a11c58-5862-7bdd-bf4f-663bdd9ad392`). |
| `session_replay` | `session_analysis_cluster` | Deliberately skipped: retired route; Replay Vision scanners provide replay coverage. |
| `replay_vision` | — | Deliberately skipped: each scanner self-authorizes through `emits_signals: true`. |

## Connected tools

No external connected tools were selected. GitHub Issues, Linear, Jira, Sentry, Zendesk, and the hidden catalog tools are **not used** in this Self-driving configuration; no responder or warehouse source was added for them.

## Scout troop

**Enabled (6 of 30):**

| Scout | Why it is on |
|---|---|
| General | Cross-product correlations and surfaces outside specialist coverage. |
| Product analytics | Core product-flow events are captured in the application. |
| Web analytics | This is a browser-based Next.js application. |
| Logs | The repository exports application logs to PostHog through OTLP. |
| Course exploration | Custom coverage for course-module and bookmark engagement. |
| Authentication intent | Custom coverage for sign-in and sign-up entry-point health. |

**Disabled (24):**

| Scout(s) | Reason |
|---|---|
| AI observability, APM, CSP violations, customer analytics, data pipelines, data warehouse, experiments, feature flags, insight alerts, MCP tool calls, revenue analytics, skills store, surveys, tasks, workflows | No evidence these product surfaces are active in this repository or available project state. Enable a relevant scout later if that surface is adopted. |
| Anomaly detection | No established high-value dashboards or insights were identified; targeted monitors are more useful on this fresh project. |
| Conversations | Support has no inbound channel yet. |
| Error tracking | Covered by the enabled native Error Tracking responders. |
| Session replay | Covered by the two Replay Vision scanners below. |
| Replay Vision | Kept off until scanner observations accumulate; it is an aggregate analyst layer, not a scanner. |
| Web vitals | No evidence of Core Web Vitals monitoring requirements beyond the selected web-analytics coverage. |
| PR follow-up | No merged Self-driving fixes exist yet to validate. |
| Inbox validation | No resolved Self-driving reports exist yet to validate. |
| Observability gaps | Disabled to keep the initial troop selective; enable later if insight-coverage recommendations are wanted. |

### Scout budget

- **Maximum:** 100 runs/day
- **Used today:** 0 runs
- **Remaining today:** 100 runs
- **Banner:** “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

## Custom scouts

| Scout | Watch surface | Discriminator | Why it is custom |
|---|---|---|---|
| `signals-scout-course-exploration` | Course-page exploration, module expansion, and course bookmarking | Interaction rate relative to course-content visitors; it only investigates sustained, broad declines with sufficient traffic | Built-in product analytics watches saved flows generally; it does not own this course-specific engagement loop. The implementation is grounded in `app/courses/[slug]/course-content.tsx`. |
| `signals-scout-auth-intent` | Header sign-in and sign-up starts | Authentication-start rate relative to healthy site traffic; it only investigates sustained, broad declines | Built-in web analytics covers site traffic but does not isolate header authentication controls. The implementation is grounded in `components/site-header.tsx`. |

Both approved scouts are enabled and emit reports by default. If either becomes noisy, set its scout config’s `emit` field to `false` in PostHog to retain dry-run observations without inbox reports.

Considered but ruled out: revenue, AI, surveys, feature flags, experiments, warehouse pipelines, CSP, and customer analytics lacked repository or server-side evidence. Error bursts and replay friction were also ruled out as custom-scout subjects because they are covered by native Error Tracking responders and Replay Vision scanners respectively.

## Replay Vision scanners

A Replay Vision scanner is an LLM that watches individual session recordings on a schedule and pushes verified visible defects to the inbox. It is the only part of this setup that spends Replay Vision quota; findings start at half weight and need independent corroboration before promotion into a report.

| Brief | Scanner | Status | Scope | Sampling | Estimate |
|---|---|---|---|---|---|
| Breakage monitor | [Course exploration breakage](https://us.posthog.com/project/599958/replay-vision/01a11c5b-e0c8-7b8f-a241-3e101eb8fcc0) | Created; signal-emitting | Recordings whose URL contains `/courses`, the product’s primary course-exploration flow; watches for failed course loading, module expansion, bookmarks, lesson content, and auth controls | 0.5 | 0 observations / 0 credits per month from the current 7-day sample |
| Frustration monitor | [Course learning frustration](https://us.posthog.com/project/599958/replay-vision/01a11c5b-e1e6-750d-9d06-837008cef72e) | Created; signal-emitting | `$rageclick` only, with no URL filter; watches visible struggle around course exploration and authentication | 1.0 | 0 observations / 0 credits per month from the current 7-day sample |

The organization currently has 2,500 Replay Vision credits remaining and is not exhausted. No recordings exist yet, so both scanners are armed and will begin observing once recording traffic arrives. Rate their first observations with thumbs up/down and a short note in Replay Vision to improve the prompts over time.

## Follow-ups

- [ ] Connect an inbound Support/Conversations channel (email, inbox, or Slack) in PostHog so enabled ticket signals can begin arriving.
- [ ] Allow the application to receive session recordings; the Replay Vision monitors and replay-backed findings remain idle until recordings arrive.
- [ ] Reauthorize the PostHog MCP connection with `action:read` and `property_definition:read` scopes if you want future setup runs to validate the live event schema directly.

## What happens next

The scout coordinator picks up fresh configurations within about 30 minutes. Scouts consume the project’s daily run budget, while replay monitors begin with the first recorded sessions. Findings cluster into reports in the [Self-driving inbox](https://us.posthog.com/project/599958/inbox); immediately actionable reports can start coding tasks.

## Files changed

- Created `posthog-self-driving-report.md`.
- No application source files were modified.
