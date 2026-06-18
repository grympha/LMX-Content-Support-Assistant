# TODO

Use this list to continue development from any PC.

## High Priority

- Verify `npm run lint` with the installed Next.js version. If `next lint` is unavailable, migrate the script to the supported ESLint CLI flow.
- Extract admin auth helper into `src/lib/adminAuth.ts` — the SHA-256 cookie check is duplicated across 6 route files (P1 debt).
- Bind the learner username cookie to an HMAC using the app password as key (currently unsigned — P1 security debt).
- Fix "today" calculations in analytics to use Malaysia timezone (UTC+8) instead of UTC midnight (P2).
- Add basic automated tests for:
  - auth route success/failure
  - chat route local fallback
  - knowledge topic matching
  - local search synonym and intent matching

## Operations

- Schedule `npm run training-retention` periodically (cron job or Render scheduled task) once volume warrants it. Currently manual.
- Add date range filters to the admin training records table.
- Add per-user detail view in the admin dashboard (completed topics, question history).
- Add a training completion summary screen for learners.
- Add export/download from the admin training records table.

## Product Improvements

- Add quiz or checkpoint questions per topic.
- Add a training completion summary screen.

## Knowledge Improvements

- When more Atlassian/Confluence exports are provided, convert them into `knowledge/topics/imported-*.md` files and keep filenames descriptive.
- Review imported duplicate/overlapping guides such as publish errors, VAST scheduling, black screen, and download app docs; merge or de-duplicate later if search results become noisy.
- Review all `knowledge/topics/` files against the latest LMX Content CMS training module.
- Keep `src/lib/lmxKnowledge.ts` fallback lessons aligned with Markdown topic files.
- Add source/version notes to the knowledge files so future maintainers know when content was last verified.
- Tune `src/lib/localSearchEngine.ts` synonym groups using real support questions from learners.
- Consider replacing local keyword retrieval with embeddings or a small local search index if topic coverage grows.

## Chat Improvements

- Move OpenAI call logic into a separate server utility for easier testing.
- Consider migrating from direct Chat Completions calls to the current preferred OpenAI API pattern.
- Improve attachment feedback for unsupported or oversized files.
- Add file type and size validation on the server, not only in the browser.
- Add a visible answer source indicator for local, knowledge, and AI provider responses.

## Security And Operations

- Consider replacing shared password auth with organization login if this becomes a wider internal tool.
- Add rate limiting or abuse protection to `/api/chat`.
- Add request size limits for chat payloads and attachments.
- Confirm Render environment variables are set only in Render and never committed.
- Rotate `DATABASE_URL` credentials periodically via Neon Console.

## Deployment Checklist

- Run `npm run typecheck`.
- Run `npm run build`.
- Test `/` login with `APP_PASSWORD`.
- Test `/admin` login with `ADMIN_PASSWORD`.
- Test local fallback with no `OPENAI_API_KEY`.
- Test AI-assisted answer if a provider key is configured.
- Verify admin Training Records table loads.
- Verify Top Learners section loads.
- Update `CHANGELOG.md` before release.
