# LMX Content Training Assistant

Internal training assistant for LMX Content CMS. The app teaches users how to use LMX Content step by step, using the uploaded **LMX Content Training Module** as the main knowledge source.

## Features

- Next.js, TypeScript, and Tailwind CSS
- Username and password-protected access with `APP_PASSWORD`
- Admin dashboard at `/admin` protected with `ADMIN_PASSWORD`
- Server-side `/api/chat` route
- Optional OpenAI integration with `OPENAI_API_KEY`
- Uploaded training module search with local training fallback
- Training topic selection for more accurate retrieval
- Training progress panel with topic completion tracking
- Optional Google Sheets progress logging through `GOOGLE_SHEETS_WEBHOOK_URL`
- Malaysia time timestamps for training records
- Ask Assistant file attachments for images, documents, CSV, and PDF
- Common Questions & Quick Answers dropdown
- Response cards with copy and clear actions
- Render.com deployment configuration

## Installation

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Set the password:

```bash
APP_PASSWORD=your-internal-password
ADMIN_PASSWORD=your-admin-password
OPENAI_API_KEY=
GOOGLE_SHEETS_WEBHOOK_URL=
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Admin dashboard:

```text
http://localhost:3000/admin
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `APP_PASSWORD` | Yes | Password required before users can access the assistant. Users also enter a username for tracking. |
| `ADMIN_PASSWORD` | Recommended | Password for `/admin`. If empty, the app falls back to `APP_PASSWORD`. |
| `OPENAI_API_KEY` | No | Enables OpenAI-assisted training responses. When empty, the app uses uploaded training knowledge plus local fallback. |
| `GOOGLE_SHEETS_WEBHOOK_URL` | No | Google Apps Script Web App URL used to save and read login, question, quick answer, and progress records. |

## Admin Dashboard

The admin dashboard is available at:

```text
/admin
```

It shows:

- total users
- total questions asked
- completed topic count
- average progress
- last activity
- searchable training record table

The dashboard reads records from the Google Apps Script URL configured in `GOOGLE_SHEETS_WEBHOOK_URL`. To enable this, the Apps Script must include both `doPost` and `doGet` from the setup below.

## User Tracking

The app records these training events when `GOOGLE_SHEETS_WEBHOOK_URL` is configured:

- user login
- training topic selected
- topic marked complete
- assistant question asked
- common quick answer selected

Training records use Malaysia time: `Asia/Kuala_Lumpur`.

Training progress is also saved in the user's browser local storage, so the progress panel still works if Google Sheets logging is not configured.

## Ask Assistant Attachments

Users can attach up to 3 files from the Ask Assistant panel.

Supported attachment types:

- Images: JPG, PNG, and other browser-supported image formats
- Documents: PDF and DOCX
- Data files: CSV, TXT, Markdown, and JSON

Text, CSV, Markdown, and JSON files are read directly in the browser. PDF and DOCX text is extracted on the server. Image analysis requires `OPENAI_API_KEY` because the assistant needs a vision-capable model to understand screenshots or photos.

Recommended usage:

- Attach the file
- Ask a specific question about the file
- Keep files below 8 MB each

## Google Sheets CSV Record Setup

Use this setup when you want admin visibility without adding a database.

1. Create a Google Sheet.
2. Rename the first tab to `Training Records`.
3. Add this header row:

```text
Timestamp | Timezone | Username | Event Type | Topic | Question | Progress Percent | Completed Topics | Source | Details
```

4. Open `Extensions > Apps Script`.
5. Paste this script:

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
      eventType: row[3] || '',
      topic: row[4] || '',
      question: row[5] || '',
      progressPercent: row[6] || '',
      completedTopics: row[7] || '',
      source: row[8] || '',
      details: row[9] || ''
    };
  });

  return ContentService
    .createTextOutput(JSON.stringify({ records: records }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

6. Click `Deploy > New deployment`.
7. Choose `Web app`.
8. Set `Execute as` to `Me`.
9. Set access to the correct internal access option for your organization. If testing fails, use `Anyone with the link` only for the webhook URL and keep the URL private.
10. Copy the Web App URL.
11. Add it in Render as:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/your-web-app-id/exec
```

If you already deployed the old Apps Script, update it and create a new deployment version:

```text
Deploy > Manage deployments > Edit > Version > New version > Deploy
```

You can export the sheet as CSV from Google Sheets using `File > Download > Comma Separated Values (.csv)`.

## Knowledge Base

The assistant searches topic files in `knowledge/topics/`. These topic files were created from the LMX Content Training Module so the assistant can retrieve the correct lesson more reliably.

Training coverage includes:

- Dashboard overview
- Create Network
- Create Location
- Create Playlist
- Create Layout
- Create Device
- Device pairing
- Installation of LMX Content App
- Default Playlist
- Scheduling and publishing content
- Playlogs and storage
- Supported Operating Systems & Hardware
- Programmatic / VAST
- Basic Troubleshooting

When users select a training topic, `/api/chat` searches the matching file in `knowledge/topics/` first. If no topic is selected, it searches all topic files and then falls back to structured local training rules in `src/lib/lmxKnowledge.ts`.

Future training tracking can add learner score, quiz results, and a summary of each person's platform understanding.

## Render Deployment

This repository includes `render.yaml`.

For manual Render Web Service setup:

```bash
npm install && npm run build
npm run start
```

Add environment variables:

```env
APP_PASSWORD=your-secure-password
ADMIN_PASSWORD=your-admin-password
NODE_VERSION=22
OPENAI_API_KEY=
GOOGLE_SHEETS_WEBHOOK_URL=
```

`OPENAI_API_KEY` and `GOOGLE_SHEETS_WEBHOOK_URL` are optional.

## GitHub Usage

Commit the generated application files directly to the `main` branch or create a feature branch for review:

```bash
git checkout -b codex/lmx-training-assistant
git add .
git commit -m "Convert app to LMX Content Training Assistant"
git push origin codex/lmx-training-assistant
```
