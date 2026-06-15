# Project Context

Use this file as the project handoff note when continuing work from another PC.

## Project Purpose

LMX Content Support Assistant is an internal training and support app for LMX Content CMS. It gives learners guided topic pages, lets them ask CMS workflow questions, supports file review, and records progress for admins when Google Sheets logging is enabled.

The app is designed to work in three modes:

- Local fallback mode: no API key required. Answers come from structured local training knowledge.
- AI-assisted mode: `CLAUDE_API_KEY` (primary), `OPENAI_API_KEY`, or `MISTRAL_API_KEY` enables richer natural language answers. Provider priority: Claude → OpenAI → Mistral → Local.
- Vault KB mode: set `VAULT_KB=true` to load all files from the full multi-folder knowledge vault instead of only `knowledge/topics/`.

## Repository

GitHub:

```text
https://github.com/grympha/LMX-Content-Support-Assistant
```

Default branch:

```text
main
```

## App Shape

Main learner app:

```text
src/app/page.tsx
```

Admin dashboard:

```text
src/app/admin/page.tsx
```

API routes:

```text
src/app/api/auth/route.ts
src/app/api/chat/route.ts
src/app/api/progress/route.ts
src/app/api/admin/auth/route.ts
src/app/api/admin/progress/route.ts
```

Core knowledge and logging libraries:

```text
src/lib/lmxKnowledge.ts
src/lib/documentKnowledge.ts
src/lib/localSearchEngine.ts
src/lib/knowledgeVaultLoader.ts
src/lib/commonQuestions.ts
src/lib/progressLog.ts
```

Training topic components:

```text
src/components/
```

Markdown knowledge vault:

```text
knowledge/
├── topics/           — 18 core training topics + 71 imported Atlassian/Confluence guides
├── faq/              — FAQ articles
├── troubleshooting/  — troubleshooting articles
├── playbooks/        — escalation playbooks
├── rca/              — Root Cause Analysis records
├── incident-library/ — incident documentation
├── platforms/        — platform-specific notes
├── config/           — search synonyms config
└── lmx-content-training-module.md
```

Atlassian/Confluence imports are named `imported-<source-title>.md` under `knowledge/topics/`. Confirmed duplicate imports are excluded from indexing via `SKIP_FILES` in `localSearchEngine.ts`. Set `VAULT_KB=true` to load the full vault instead of only `knowledge/topics/`.

Static screenshots:

```text
public/
```

## Authentication

The main app uses `APP_PASSWORD`.

Learners must enter:

- username
- password

Successful login sets two HTTP-only cookies:

- `lmx-support-session`
- `lmx-support-user`

The admin app uses `ADMIN_PASSWORD`. If `ADMIN_PASSWORD` is empty, it falls back to `APP_PASSWORD`.

Admin login sets:

- `lmx-admin-session`

## Chat Flow

The learner asks a question from the Ask Assistant panel in `src/app/page.tsx`.

The request goes to:

```text
POST /api/chat
```

The chat route:

1. Confirms the learner is authenticated.
2. Extracts text from TXT, CSV, Markdown, JSON, PDF, and DOCX attachments.
3. Keeps image attachments as data URLs for OpenAI vision analysis when enabled.
4. Searches `knowledge/topics/` through the local search engine.
5. Logs the question through `logProgressEvent`.
6. Uses local search and template answers if no AI provider is configured.
7. Calls Claude (`CLAUDE_API_KEY`) if configured — default model `claude-haiku-4-5`, override via `CLAUDE_MODEL`.
8. Falls back to OpenAI (`OPENAI_API_KEY`) if Claude is not configured or fails — default model `gpt-4o-mini`, override via `OPENAI_MODEL`.
9. Falls back to Mistral (`MISTRAL_API_KEY`) if OpenAI is also unavailable — default model `mistral-small-latest`, override via `MISTRAL_MODEL`.
10. Falls back to local knowledge if all API calls fail.

Provider priority: **Claude → OpenAI → Mistral → Local fallback**.

## Knowledge Retrieval

Deep local retrieval is implemented in:

```text
src/lib/localSearchEngine.ts
```

It performs:

- Markdown section chunking
- natural wording and synonym expansion
- local intent detection
- weighted scoring by topic, heading, exact phrase, and body matches
- confidence detection
- answer templates for how-to, troubleshooting, requirements, reporting, and general questions

The older simple topic retrieval helper remains in:

```text
src/lib/documentKnowledge.ts
```

Important behavior:

- All Markdown files in `knowledge/topics/` are searched.
- If a learner selected a training topic, matching chunks from that topic receive a score boost.
- The local search engine ranks smaller Markdown chunks instead of whole files.
- If confidence is low, the assistant asks for a clearer module, screen, or issue instead of guessing.

Current behavior after the Atlassian imports:

- All Markdown files in `knowledge/topics/` are searched.
- Selected topics receive a score boost, but imported docs can still match even when a topic is selected.
- Imported documents are named `imported-<source-title>.md`.

Structured fallback answers are implemented in:

```text
src/lib/lmxKnowledge.ts
```

This file defines:

- `IssueCategory`
- `issueCategories`
- `lmxKnowledge`
- `assistantSystemPrompt`
- `buildFallbackResponse`

When adding a new topic, update:

- `IssueCategory`
- `issueCategories`
- `lmxKnowledge`
- `topicFiles` in `documentKnowledge.ts`
- `knowledge/topics/`
- `TopicContent` in `src/app/page.tsx` if the topic needs a custom page

## Progress Tracking

Progress tracking is split between browser local storage and optional Google Sheets logging.

Browser-side progress:

```text
src/components/ProgressPanel.tsx
```

Server-side logging:

```text
src/lib/progressLog.ts
```

Progress events:

- `login`
- `topic_selected`
- `topic_completed`
- `question_asked`
- `quick_answer_selected`

Timestamps are formatted in:

```text
Asia/Kuala_Lumpur
```

If `GOOGLE_SHEETS_WEBHOOK_URL` is not configured, logging quietly does nothing and the app remains usable.

## Admin Dashboard

The admin dashboard lives at:

```text
/admin
```

It reads:

```text
GET /api/admin/progress
```

That API route fetches records from the configured Google Apps Script URL. The dashboard shows:

- total users
- questions asked
- topics completed
- quick answers used
- average progress
- latest activity
- searchable training records table

## Attachments

The Ask Assistant accepts up to 3 files.

Limits and behavior:

- Max 8 MB per file in the browser UI.
- Text-like files are read in the browser.
- PDF extraction uses `pdf-parse` on the server.
- DOCX extraction uses `mammoth` on the server.
- Image understanding requires `OPENAI_API_KEY`.
- Text attachment context is capped in the API route with `maxAttachmentCharacters`.

## Styling

The app uses Tailwind CSS with colors defined in:

```text
tailwind.config.ts
src/app/globals.css
```

The current UI is an internal work tool style:

- restrained panels
- teal signal color
- slate text and borders
- rounded-md/rounded-lg controls
- lucide-react icons

## Deployment

Render deployment is configured in:

```text
render.yaml
```

Current deployment assumptions:

- Node 22
- build command: `npm install && npm run build`
- start command: `npm run start`
- required env var: `APP_PASSWORD`
- recommended env var: `ADMIN_PASSWORD`
- optional env vars: `CLAUDE_API_KEY`, `CLAUDE_MODEL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `MISTRAL_API_KEY`, `MISTRAL_MODEL`, `VAULT_KB`, `GOOGLE_SHEETS_WEBHOOK_URL`

## Known Technical Notes

- `npm run lint` uses `next lint`, but modern Next.js versions may require migrating to the ESLint CLI if `next lint` is removed or unavailable.
- The app currently uses the Chat Completions endpoint directly in `src/app/api/chat/route.ts`.
- Vitest test suite: 20 tests across 6 files in `src/__tests__/`. Run with `npm test`. Coverage: auth route, chat provider selection, local search E2E, vault KB parity, diagnostics analyzer, progress logging.
- Authentication is simple password-based access, not full user identity management.
- Google Sheets is used as a lightweight activity log, not a database.
- Knowledge retrieval is local weighted keyword and synonym scoring, not embeddings/vector search.

## Safe Editing Checklist

Before making changes from a new PC:

1. Pull the latest `main`.
2. Run `npm install`.
3. Create `.env.local` from `.env.example`.
4. Run `npm run typecheck`.
5. Run `npm test`.
6. Run `npm run build`.
7. Test learner login, Ask Assistant, topic completion, and admin login locally.

Before pushing:

1. Check `git status`.
2. Avoid committing `.env.local`.
3. Update `CHANGELOG.md` for notable changes.
4. Update `TODO.md` when finishing or adding follow-ups.
5. Commit with a clear message.
