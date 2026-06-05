# Claude Integration Notes

This repository currently uses OpenAI for optional chat-powered support workflow enhancement. If you want to add support for Anthropic Claude in the future, use this file to document the integration assumptions and required environment variables.

## Suggested integration approach

- Add an optional environment variable such as `CLAUDE_API_KEY`.
- Keep Claude integration optional, with the app falling back to local knowledge if the key is not configured.
- Prefer Claude when `CLAUDE_API_KEY` is available, otherwise use `OPENAI_API_KEY` if configured.
- Use Claude for natural language question answering, taking care to:
  - include the structured local training knowledge context
  - avoid hallucination by constraining responses to the known LMX Content dataset
  - limit token usage for cost control

## API route behavior

The `/api/chat` route should:

1. validate learner authentication
2. extract and normalize attachments for text content
3. search `knowledge/topics/` for relevant context
4. build a prompt that includes:
   - local knowledge snippets
   - topic intake information
   - any uploaded text attachments
5. call Claude when `CLAUDE_API_KEY` is present
6. fall back to OpenAI when Claude fails and `OPENAI_API_KEY` is configured
7. fall back to local knowledge when no provider is configured or all API calls fail

## Possible environment variables

- `CLAUDE_API_KEY` – Anthropic API key for Claude access
- `CLAUDE_MODEL` – optional model override (default: `claude-haiku-4-5`)
- `CLAUDE_API_URL` – optional base URL if using a proxy or alternative endpoint

## Sample Claude request

Anthropic's Messages API differs from OpenAI's — note the endpoint, auth header, required `anthropic-version` header, `max_tokens`, and response shape.

```js
// System goes as a top-level param, not a message role.
// Consecutive same-role user messages must be merged before sending.
const response = await fetch(process.env.CLAUDE_API_URL || "https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.CLAUDE_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: process.env.CLAUDE_MODEL || "claude-haiku-4-5",
    max_tokens: 2048,
    system: "Use the local LMX Content training knowledge as the primary source.",
    messages: [
      { role: "user", content: "..." }
    ]
  })
});

// Response shape: { content: [{ type: "text", text: "..." }] }
const data = await response.json();
const reply = data.content?.find(b => b.type === "text")?.text;
```

## Notes

- Keep the local fallback in place so the assistant remains usable without any API key.
- Do not send sensitive or private tenant details to Claude unless the environment is intended for internal support only.
- Update both `README.md` and `PROJECT_CONTEXT.md` if Claude support becomes a permanent feature.

## Testing and safety

- Add tests for Claude route selection and fallback behavior.
- Validate that attachments are sanitized before being sent to the API.
- Ensure responses include a visible source indicator such as `source: "claude"`.

## Notes

This file is intentionally generic so it can be updated when a specific Claude integration strategy is chosen.
