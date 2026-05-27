# LMX Content Support Assistant

Internal Level 1 support assistant for LMX Content CMS. The app gives support teammates a password-protected dashboard, issue intake form, and structured troubleshooting replies that follow a consistent senior-support format.

## Features

- Next.js, TypeScript, and Tailwind CSS
- Password-protected assistant access with `APP_PASSWORD`
- Server-side `/api/chat` route
- Optional OpenAI integration with `OPENAI_API_KEY`
- Local fallback knowledge base when OpenAI is not configured
- Issue intake form for LMX support context
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
| `OPENAI_API_KEY` | No | Enables OpenAI responses. When empty, the local LMX knowledge base is used. |

## Render Deployment

This repository includes `render.yaml`.

1. Push the repository to GitHub.
2. In Render, create a new Blueprint from the repository.
3. Add `APP_PASSWORD` as a secret environment variable.
4. Optionally add `OPENAI_API_KEY`.
5. Deploy.

Render uses:

```bash
npm install && npm run build
npm run start
```

## GitHub Usage

Commit the generated application files directly to the `main` branch or create a feature branch for review:

```bash
git checkout -b codex/lmx-support-assistant
git add .
git commit -m "Build LMX Content Support Assistant MVP"
git push origin codex/lmx-support-assistant
```

Then open a pull request into `main`.
