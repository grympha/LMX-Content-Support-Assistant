# TODO

Use this list to continue development from any PC.

## High Priority

- Verify `npm run lint` with the installed Next.js version. If `next lint` is unavailable, migrate the script to the supported ESLint CLI flow.
- Run `npm install`, `npm run typecheck`, and `npm run build` on a PC with Node/npm available after the local search engine change.
- Add basic automated tests for:
  - auth route success/failure
  - chat route local fallback
  - knowledge topic matching
  - local search synonym and intent matching
  - progress logging no-op when `GOOGLE_SHEETS_WEBHOOK_URL` is empty
- Confirm the Google Sheets Apps Script header matches the current logged fields, especially `Full Name`.
- Add a real production secret rotation note for `APP_PASSWORD`, `ADMIN_PASSWORD`, and `OPENAI_API_KEY`.

## Product Improvements

- Add export/download from the admin training records table.
- Add date range filters to the admin dashboard.
- Add per-user detail view for completed topics and questions.
- Add a training completion summary screen.
- Add quiz or checkpoint questions per topic.
- Add a clearer empty state when `GOOGLE_SHEETS_WEBHOOK_URL` is missing in admin.

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
- Add a visible answer source indicator for local, knowledge, and OpenAI responses.

## Security And Operations

- Consider replacing shared password auth with organization login if this becomes a wider internal tool.
- Add rate limiting or abuse protection to `/api/chat`.
- Add request size limits for chat payloads and attachments.
- Avoid logging sensitive learner questions into Google Sheets if they may include client/private details.
- Confirm Render environment variables are set only in Render and never committed.

## Deployment Checklist

- Run `npm run typecheck`.
- Run `npm run build`.
- Test `/` login with `APP_PASSWORD`.
- Test `/admin` login with `ADMIN_PASSWORD`.
- Test local fallback with no `OPENAI_API_KEY`.
- Test OpenAI-assisted answer if an API key is configured.
- Test Google Sheets logging if `GOOGLE_SHEETS_WEBHOOK_URL` is configured.
- Update `CHANGELOG.md` before release.
