# LMX Content Support Assistant

Internal Next.js training and support assistant for LMX Content CMS. It helps learners understand CMS workflows, ask support questions, review files, track topic progress, and let admins monitor training activity.

This repository is documented so work can continue from any PC:

- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) explains the architecture, important files, data flow, and development notes.
- [CHANGELOG.md](CHANGELOG.md) records project changes.
- [TODO.md](TODO.md) lists next work and known follow-ups.

## Current Capabilities

- Password-protected learner access with `APP_PASSWORD`
- Admin dashboard at `/admin` protected by `ADMIN_PASSWORD`
- Topic-based LMX Content CMS training pages
- Ask Assistant panel with local knowledge fallback
- Optional Claude (Anthropic) answers through `CLAUDE_API_KEY` (primary AI provider)
- Optional OpenAI-powered answers through `OPENAI_API_KEY`
- Optional Mistral AI answers through `MISTRAL_API_KEY` (free alternative provider)
- File attachments for images, PDFs, DOCX, CSV, TXT, Markdown, and JSON
- Local topic knowledge search from `knowledge/topics/`
- Common questions and quick answers
- Learner progress panel with browser local storage persistence
- Training events and user progress stored in Neon PostgreSQL
- Admin dashboard reads training records, analytics, and user progress from Neon
- Render deployment config in `render.yaml`

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- lucide-react icons
- Neon PostgreSQL (training events, user progress, conversation history)
- Drizzle ORM
- Optional Claude (Anthropic) Chat API
- Optional OpenAI Chat Completions API
- Optional Mistral AI Chat API

## Quick Start

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env.local
```

Set at least the app password and database URL:

```env
APP_PASSWORD=your-internal-password
ADMIN_PASSWORD=your-admin-password
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin dashboard:

```text
http://localhost:3000/admin
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm test

# One-time historical import from a Google Sheets CSV export
npm run import:training-events -- path/to/export.csv --dry-run
npm run import:training-events -- path/to/export.csv

# Training data retention cleanup (see docs/GOOGLE_SHEETS_TO_NEON_IMPORT.md)
npm run training-retention -- --dry-run
npm run training-retention
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `APP_PASSWORD` | Yes | Learner password for the main app. Users also enter a username for progress tracking. |
| `ADMIN_PASSWORD` | Recommended | Admin password for `/admin`. If empty, admin auth falls back to `APP_PASSWORD`. |
| `DATABASE_URL` | Recommended | Neon PostgreSQL connection string. Required for training events, user progress, and conversation history. Without it the app still works but data is not persisted. |
| `MAX_CONVERSATIONS_PER_USER` | No | Maximum saved conversations per user. Defaults to 50. |
| `CLAUDE_API_KEY` | No | Enables Claude as the primary AI provider. |
| `CLAUDE_MODEL` | No | Optional Claude model override. Defaults to `claude-haiku-4-5`. |
| `CLAUDE_API_URL` | No | Optional Claude API base URL if using a proxy or alternative endpoint. |
| `OPENAI_API_KEY` | No | Enables OpenAI-assisted answers and image attachment analysis. |
| `OPENAI_MODEL` | No | Optional OpenAI model override. Defaults to `gpt-4o-mini`. |
| `MISTRAL_API_KEY` | No | Mistral AI API key. Used in the provider fallback chain (Claude → OpenAI → Mistral). |
| `MISTRAL_MODEL` | No | Optional Mistral model override. Defaults to `mistral-small-latest`. |
| `VAULT_KB` | No | Set to `true` to use the full vault-backed knowledge retrieval path (reads all folders under `knowledge/`). |

## Knowledge Base

The assistant searches Markdown files across a multi-folder knowledge vault:

```text
knowledge/
├── topics/          — core 18 training topics + 71 imported Atlassian/Confluence guides
├── faq/             — FAQ articles (device pairing, formats, system requirements, etc.)
├── troubleshooting/ — step-by-step troubleshooting articles (login, sync, upload, etc.)
├── playbooks/       — escalation playbooks for high-volume support scenarios
├── rca/             — Root Cause Analysis records
├── incident-library/ — documented incidents with resolution notes
├── platforms/       — platform-specific notes (Android, Windows, webOS, BrightSign)
└── config/          — search configuration (synonyms)
```

Estimated support coverage: **~87% of top-30 common support scenarios**.

All production vault files include `category`, `keywords`, `description`, and `search_priority` frontmatter to improve retrieval accuracy.

Imported Atlassian/Confluence exports are named `imported-<source-title>.md` under `knowledge/topics/`. Confirmed duplicates are excluded via `SKIP_FILES` in `localSearchEngine.ts`.

Full training module reference:

```text
knowledge/lmx-content-training-module.md
```

Structured fallback knowledge lives in:

```text
src/lib/lmxKnowledge.ts
```

When adding or changing a topic, keep these places aligned:

- `knowledge/topics/<topic>.md`
- `src/lib/documentKnowledge.ts` topic file mapping
- `src/lib/lmxKnowledge.ts` issue categories and fallback lesson
- Topic page component under `src/components/`, if the topic needs a custom screen

## Render Deployment

This repository includes `render.yaml`.

Manual Render setup:

```bash
npm install && npm run build
npm run start
```

Render environment variables:

```env
NODE_VERSION=22
APP_PASSWORD=your-secure-password
ADMIN_PASSWORD=your-admin-password
DATABASE_URL=postgresql://user:password@host.neon.tech/neondb?sslmode=require
CLAUDE_API_KEY=
OPENAI_API_KEY=
MISTRAL_API_KEY=
```

## Continue Work From Another PC

```bash
git clone https://github.com/grympha/LMX-Content-Support-Assistant.git
cd LMX-Content-Support-Assistant
npm install
cp .env.example .env.local
npm run dev
```

Then read:

```text
PROJECT_CONTEXT.md
CHANGELOG.md
TODO.md
```
