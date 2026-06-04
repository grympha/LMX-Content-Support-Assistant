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
- Optional OpenAI-powered answers through `OPENAI_API_KEY`
- File attachments for images, PDFs, DOCX, CSV, TXT, Markdown, and JSON
- Local topic knowledge search from `knowledge/topics/`
- Common questions and quick answers
- Learner progress panel with browser local storage persistence
- Optional Google Sheets logging through `GOOGLE_SHEETS_WEBHOOK_URL`
- Render deployment config in `render.yaml`

## Tech Stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS
- lucide-react icons
- Optional OpenAI Chat Completions API
- Optional Google Apps Script + Google Sheets tracking

## Quick Start

Install dependencies:

```bash
npm install
```

Create the local environment file:

```bash
cp .env.example .env.local
```

Set at least the app password:

```env
APP_PASSWORD=your-internal-password
ADMIN_PASSWORD=your-admin-password
OPENAI_API_KEY=
GOOGLE_SHEETS_WEBHOOK_URL=
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
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `APP_PASSWORD` | Yes | Learner password for the main app. Users also enter a username for progress tracking. |
| `ADMIN_PASSWORD` | Recommended | Admin password for `/admin`. If empty, admin auth falls back to `APP_PASSWORD`. |
| `OPENAI_API_KEY` | No | Enables OpenAI-assisted answers and image attachment analysis. Without it, the app uses local knowledge fallback. |
| `OPENAI_MODEL` | No | Optional model override. The chat route currently defaults to `gpt-4o-mini`. |
| `GOOGLE_SHEETS_WEBHOOK_URL` | No | Google Apps Script Web App URL for logging and reading training records. |

## Knowledge Base

The assistant searches Markdown training files in:

```text
knowledge/topics/
```

This folder includes the original topic files plus imported Atlassian/Confluence `.doc` exports prefixed with `imported-`.

The full module is stored at:

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

## Google Sheets Tracking

Tracking is optional. If `GOOGLE_SHEETS_WEBHOOK_URL` is configured, the app logs:

- login
- topic selected
- topic completed
- assistant question asked
- quick answer selected

Expected Google Sheet header:

```text
Timestamp | Timezone | Username | Full Name | Event Type | Topic | Question | Progress Percent | Completed Topics | Source | Details
```

The current admin page also contains compatibility handling for older sheets that did not include `Full Name`.

Minimal Apps Script:

```js
function getTrainingSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Training Records');
}

function doPost(e) {
  var sheet = getTrainingSheet();
  var data = JSON.parse(e.postData.contents || '{}');

  sheet.appendRow([
    data.timestamp || '',
    data.timezone || 'Asia/Kuala_Lumpur',
    data.username || '',
    data.fullName || '',
    data.eventType || '',
    data.topic || '',
    data.question || '',
    data.progressPercent || '',
    (data.completedTopics || []).join(', '),
    data.source || '',
    data.details || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var sheet = getTrainingSheet();
  var values = sheet.getDataRange().getValues();
  var rows = values.slice(1);

  var records = rows.map(function(row) {
    return {
      timestamp: row[0] || '',
      timezone: row[1] || '',
      username: row[2] || '',
      fullName: row[3] || '',
      eventType: row[4] || '',
      topic: row[5] || '',
      question: row[6] || '',
      progressPercent: row[7] || '',
      completedTopics: row[8] || '',
      source: row[9] || '',
      details: row[10] || ''
    };
  });

  return ContentService
    .createTextOutput(JSON.stringify({ records: records }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Deploy it as a Google Apps Script Web App and set `GOOGLE_SHEETS_WEBHOOK_URL` to the deployment URL.

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
OPENAI_API_KEY=
GOOGLE_SHEETS_WEBHOOK_URL=
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
