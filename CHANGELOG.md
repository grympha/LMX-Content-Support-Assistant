# Changelog

All notable project changes are recorded here.

---

## [v0.3.0] — 2026-06-15 — Knowledge Vault Expansion Sprint

### Knowledge Vault

- Expanded vault from flat `knowledge/topics/` to a structured multi-folder layout: `faq/`, `troubleshooting/`, `rca/`, `incident-library/`, `playbooks/`, `platforms/`, `config/`, `ssp/`, `max-dsp/`, `customer-training/`, `deployment-checklists/`
- Added full frontmatter (`category`, `keywords`, `description`, `related_topics`, `search_priority`) to all 29 production vault files across faq/, rca/, troubleshooting/, and incident-library/
- Added 5 support playbooks for the highest-volume escalation scenarios: black screen logo issue, device offline fluctuating, missing playlog, old content still showing, unable to publish
- Added 10 structured troubleshooting articles: Device-Pairing-Troubleshooting, Schedule-Not-Applying, Content-Not-Updating, Restarting-The-Player-Application, Login-Issues, Upload-Errors, Bundle-Scheduling-Issues, HTML-ZIP-Content, Black Screen, Application Force Close
- Added 10 FAQ articles: Firewall-And-Network-Requirements, Change-Device-Orientation, Update-Android-WebView, Device Pairing, Device Replacement, Supported Formats, System Requirements, Default Playlist, Playlogs, Pull To Content
- Added 9 RCA records (VAST crash, resolution mismatch, campaign missing, default playlist issue, playlog campaign/device name, NovaStar TB60, programmatic creative source, pull-to-content mapping)
- Added 7 incident library posts with `category` and `keyword` frontmatter
- Added 5 platform articles: android, windows, linux, lg-webos, brightsign
- Added frontmatter to 5 high-value imported files to enable category-matched retrieval: auto-boot-shutdown, user-roles-and-permissions, heartbeat-mechanism, content-not-syncing, android-apk-troubleshooting
- Deduplicated 4 confirmed identical imported file pairs via `SKIP_FILES` in `localSearchEngine.ts` (Place Exchange widget, VAST+URL, publish error, download app)
- Added 36+ cross-links connecting imported island files to structured articles and `HOME.md`
- Added `knowledge/config/synonyms.md` for search synonym configuration
- Support coverage estimate: ~87% of top-30 common support scenarios (up from ~60% baseline)

### Search Engine (`src/lib/localSearchEngine.ts`)

- Added folder priority scoring: playbooks (300), platforms/rca (250), incident-library (200), troubleshooting (150), faq (120), common-support-questions (100), customer-training (80), topics (40)
- Added `+100` IssueCategory intake bonus for category-matched queries
- Added `VAULT_KB` environment flag for vault-backed retrieval path (`knowledgeVaultLoader.ts`)
- Added `SKIP_FILES` exclusion set for duplicates and template files
- Extended synonym groups for new topic vocabulary (WebView, bundle scheduling, login, upload)
- Added `search_priority` frontmatter field parsed and stored on all vault chunks

### AI Provider Support (`src/app/api/chat/route.ts`)

- Added Claude (Anthropic) integration — `CLAUDE_API_KEY` activates Claude as primary AI provider
- Added Mistral AI as free LLM provider — `MISTRAL_API_KEY` activates Mistral in the fallback chain
- Provider priority: Claude → OpenAI → Mistral → Local knowledge fallback
- Default Claude model: `claude-haiku-4-5` (overridable via `CLAUDE_MODEL`)
- Default Mistral model: `mistral-small-latest` (overridable via `MISTRAL_MODEL`)
- Conversation history passed to all AI providers for context continuity

### Testing

- Added Vitest test suite: 20 tests across 6 test files (`src/__tests__/`)
- Coverage: auth route, chat route provider selection, local search E2E, vault KB parity (VAULT_KB=true/false), diagnostics analyzer, progress logging no-op
- All 20 tests pass against production build

### Documentation

- Added `CLAUDE.md` — Claude Code integration notes and API route behaviour spec
- Updated `README.md` — added Claude, Mistral, vault structure, and test information
- Updated `PROJECT_CONTEXT.md` — updated chat flow, vault structure, library list, and test status

---

## [v0.2.0] — Knowledge Base and Local Search Update

### Added

- Improved Ask Assistant local answers with support playbooks returning `What to check`, `How to fix`, `Next action`, and `Client response` sections.
- Added platform requirement logic so questions like "Android devices requirement" return exact OS, processor, system type, RAM/ROM, action, and client response details.
- Imported second batch of 38 Atlassian/Confluence `.doc` exports into `knowledge/topics/` as searchable Markdown files.
- Imported 33 Atlassian/Confluence `.doc` exports into `knowledge/topics/` as searchable Markdown files.
- Updated local search to search all topic Markdown files while still boosting the selected topic.
- Added local deep-search engine for Ask Assistant without requiring an API key.
- Added Markdown chunking, synonym expansion, intent detection, confidence scoring, and answer templates for local answers.
- Added project handoff documentation: `README.md`, `PROJECT_CONTEXT.md`, `CHANGELOG.md`, `TODO.md`.

### Notes

- App is a Next.js LMX Content CMS training assistant with learner auth, admin auth, topic pages, chat support, attachment handling, local knowledge fallback, optional OpenAI responses, optional Google Sheets logging, and Render deployment.
- Ask Assistant uses `src/lib/localSearchEngine.ts` for no-key local responses and for stronger knowledge context when OpenAI is enabled.

---

## Existing Baseline

### Included

- Next.js 15 App Router.
- Learner access via `APP_PASSWORD`.
- Admin dashboard via `ADMIN_PASSWORD` (fallback to `APP_PASSWORD`).
- `/api/chat` with local fallback and optional OpenAI integration.
- Knowledge files in `knowledge/topics/` and structured fallback in `src/lib/lmxKnowledge.ts`.
- Common questions and quick answers.
- Learner progress panel (browser local storage).
- Optional Google Sheets progress and activity logging.
- Attachment support: image, text, CSV, Markdown, JSON, PDF, DOCX.
- Render deployment file.
