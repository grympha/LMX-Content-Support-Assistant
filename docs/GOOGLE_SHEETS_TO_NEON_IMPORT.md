# Google Sheets → Neon Training Events Import Guide

One-time migration of historical LMX Content training records from Google Sheets into the Neon `training_events` table.

---

## Prerequisites

1. **Neon tables exist** — run the Phase 1 SQL migration in the Neon SQL Console if you haven't already:

   ```sql
   CREATE TABLE IF NOT EXISTS training_events ( ... );
   CREATE TABLE IF NOT EXISTS user_progress ( ... );
   ```

   Full SQL is in the previous migration report.

2. **`DATABASE_URL` is set** — add it to `.env.local` (never commit this file):

   ```
   DATABASE_URL=postgresql://...@...neon.tech/neondb?sslmode=require
   ```

3. **Dependencies installed** — `tsx` must be present:

   ```bash
   npm install
   ```

---

## Export the Google Sheet

1. Open the training records Google Sheet.
2. Go to **File → Download → Comma Separated Values (.csv)**.
3. Save it somewhere accessible, e.g. `~/Downloads/training-export.csv`.

The script accepts any column order as long as the **header row** is present and uses recognisable column names (case-insensitive, spaces/hyphens normalised):

| Accepted header variants | Maps to |
|---|---|
| `timestamp`, `date`, `datetime` | `logged_at` |
| `username`, `user`, `user_name` | `username` |
| `full_name`, `fullName`, `name` | `full_name` |
| `event_type`, `eventType`, `event`, `type` | `event_type` |
| `topic` | `topic` |
| `question` | `question` |
| `progress_percent`, `progressPercent`, `progress` | `progress_percent` |
| `completed_topics`, `completedTopics` | `completed_topics` |
| `source` | `source` |
| `details`, `detail` | `details` |
| `timezone`, `tz` | *(ignored)* |

---

## Dry Run First

Always preview before writing to Neon:

```bash
npm run import:training-events -- path/to/training-export.csv --dry-run
```

Output shows:
- Total rows parsed and any skipped (bad timestamp / unknown event type / empty username)
- Per-event-type counts
- Unique user list

If the counts look wrong, check the CSV header row and column order.

---

## Live Import

```bash
npm run import:training-events -- path/to/training-export.csv
```

The script:

1. Loads all existing `training_events` rows to build a dedup key set.
2. For each CSV row, computes a soft-dedup key:
   `username || event_type || topic || question[0:50] || minute-truncated-timestamp || source`
3. Inserts only rows whose key is not already in Neon (batch size 100).
4. For each `topic_completed` row belonging to a user not yet in `user_progress`, inserts a new progress record (`onConflictDoNothing` — live Phase 2 data is never overwritten).
5. Prints a final summary with inserted counts, skipped duplicates, and errors.

---

## Field Mapping Details

| Google Sheets column | Neon column | Notes |
|---|---|---|
| `timestamp` | `logged_at` | Malaysia time (UTC+8) → UTC. Format: `DD/MM/YYYY, HH:MM:SS` or ISO. |
| `username` | `username` | Required. Rows with empty username are skipped. |
| `full_name` | `full_name` | Optional. |
| `event_type` | `event_type` | Must match: `login`, `topic_selected`, `topic_completed`, `question_asked`, `quick_answer_selected`. |
| `topic` | `topic` | Optional. |
| `question` | `question` | Optional. |
| `progress_percent` | `progress_percent` | Numeric string. `%` suffix is stripped. |
| `completed_topics` | `completed_topics` | JSON array `["A","B"]`, semicolon-separated, or comma-separated. |
| `source` | `source` | Optional. |
| `details` | `details` | Optional. |
| `timezone` | *(ignored)* | Timestamp is always treated as Malaysia time (UTC+8). |

---

## Verification SQL

Run these in the Neon SQL Console after import:

```sql
-- Total imported rows
SELECT COUNT(*) FROM training_events;

-- Breakdown by event type
SELECT event_type, COUNT(*) AS n
FROM training_events
GROUP BY event_type
ORDER BY n DESC;

-- Per-user event counts
SELECT username, COUNT(*) AS events
FROM training_events
GROUP BY username
ORDER BY events DESC
LIMIT 20;

-- Users in user_progress
SELECT username, progress_percent, array_length(completed_topics, 1) AS topics_done
FROM user_progress
ORDER BY progress_percent::numeric DESC;

-- Oldest and newest imported timestamps
SELECT MIN(logged_at) AS oldest, MAX(logged_at) AS newest
FROM training_events;

-- Check for any duplicates (should return no rows after a clean import)
SELECT username, event_type, topic,
       LEFT(question, 50) AS q_prefix,
       DATE_TRUNC('minute', logged_at) AS ts_minute,
       source,
       COUNT(*) AS n
FROM training_events
GROUP BY 1,2,3,4,5,6
HAVING COUNT(*) > 1
ORDER BY n DESC;
```

---

## Safety Rules

- **Never run the live import without a dry run first.**
- **Never run on a production DATABASE_URL without verifying against staging first** (if a staging environment exists).
- **The import is idempotent** — running it twice is safe; duplicates are detected and skipped.
- **Google Sheets is never touched** — the script is read-only with respect to Google Sheets.
- **Do not commit** `DATABASE_URL` or the CSV export to the repository.
- The script **never deletes** any existing Neon rows.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `ERROR: DATABASE_URL is not set` | Add `DATABASE_URL=...` to `.env.local` |
| `ERROR: Could not query training_events` | Run Phase 1 SQL migration in Neon Console first |
| All rows skipped as "unrecognised event_type" | Check that the event_type column header is present and the values match expected strings |
| `possible column shift detected` | The CSV columns are in the wrong order or have non-standard headers — re-export with correct headers |
| Timestamps off by 8 hours | Timestamps must be in Malaysia local time (UTC+8); the script subtracts 8h to store UTC |
| `Parse errors` for a minority of rows | Check those row numbers in the CSV for blank cells or unusual formatting |
