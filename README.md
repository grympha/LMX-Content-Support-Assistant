# LMX Content Training Assistant

Internal training assistant for LMX Content CMS. The app teaches users how to use LMX Content step by step, using the uploaded **LMX Content Training Module** as the main knowledge source.

## Features

- Next.js, TypeScript, and Tailwind CSS
- Password-protected access with `APP_PASSWORD`
- Server-side `/api/chat` route
- Optional OpenAI integration with `OPENAI_API_KEY`
- Uploaded training module search with local training fallback
- Training context form for tenant, network, location, device, schedule, and current goal
- Quick lessons for networks, locations, playlists, devices, default playlist, scheduling, publishing, playlogs, and VAST
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
OPENAI_API_KEY=
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `APP_PASSWORD` | Yes | Password required before users can access the assistant. |
| `OPENAI_API_KEY` | No | Enables OpenAI-assisted training responses. When empty, the app uses uploaded training knowledge plus local fallback. |

## Knowledge Base

The assistant searches `knowledge/lmx-content-training-module.md`, which was extracted from the LMX Content Training Module PDF.

Training coverage includes:

- Dashboard overview
- Create Network
- Create Location
- Create Playlist
- Create Layout
- Create Device
- Device pairing
- Default Playlist
- Scheduling and publishing content
- Playlogs and storage
- Android, Windows, Linux, LG webOS, and BrightSign requirements
- URL, Google IMA/VAST, Hivestack, and programmatic guidance

When users ask questions, `/api/chat` searches the uploaded training module first, then falls back to structured local training rules in `src/lib/lmxKnowledge.ts`.

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
NODE_VERSION=22
OPENAI_API_KEY=
```

`OPENAI_API_KEY` is optional.

## GitHub Usage

Commit the generated application files directly to the `main` branch or create a feature branch for review:

```bash
git checkout -b codex/lmx-training-assistant
git add .
git commit -m "Convert app to LMX Content Training Assistant"
git push origin codex/lmx-training-assistant
```
