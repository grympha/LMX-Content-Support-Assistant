# Changelog

All notable project changes should be recorded here.

## Unreleased

### Added

- Added project handoff documentation:
  - `README.md`
  - `PROJECT_CONTEXT.md`
  - `CHANGELOG.md`
  - `TODO.md`

### Notes

- The current app is a Next.js LMX Content CMS training assistant with learner auth, admin auth, topic pages, chat support, attachment handling, local knowledge fallback, optional OpenAI responses, optional Google Sheets logging, and Render deployment configuration.

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
