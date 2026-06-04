# Changelog

All notable project changes should be recorded here.

## Unreleased

### Added

- Imported 33 Atlassian/Confluence `.doc` exports into `knowledge/topics/` as searchable Markdown files.
- Updated local search to search all topic Markdown files while still boosting the selected topic.
- Added local deep-search engine for Ask Assistant without requiring an API key.
- Added Markdown chunking, synonym expansion, intent detection, confidence scoring, and answer templates for local answers.
- Added project handoff documentation:
  - `README.md`
  - `PROJECT_CONTEXT.md`
  - `CHANGELOG.md`
  - `TODO.md`

### Notes

- The current app is a Next.js LMX Content CMS training assistant with learner auth, admin auth, topic pages, chat support, attachment handling, local knowledge fallback, optional OpenAI responses, optional Google Sheets logging, and Render deployment configuration.
- Ask Assistant now uses `src/lib/localSearchEngine.ts` for no-key local responses and for stronger knowledge context when OpenAI is enabled.

## Existing Baseline

### Included

- Next.js 15 App Router app.
- Learner access through `APP_PASSWORD`.
- Admin dashboard through `ADMIN_PASSWORD` with fallback to `APP_PASSWORD`.
- `/api/chat` route with local fallback and optional OpenAI API integration.
- Knowledge files in `knowledge/topics/` and structured fallback knowledge in `src/lib/lmxKnowledge.ts`.
- Common questions and quick answers.
- Learner progress panel using browser local storage.
- Optional Google Sheets progress and activity logging.
- Attachment support for image, text, CSV, Markdown, JSON, PDF, and DOCX files.
- Render deployment file.
