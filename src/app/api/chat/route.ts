import { NextResponse } from "next/server";
import {
  assistantSystemPrompt,
  buildFallbackResponse,
  type IssueIntake
} from "@/lib/lmxKnowledge";
import {
  buildDocumentContext,
  mergeDocumentContextIntoFallback,
  searchTrainingKnowledge
} from "@/lib/documentKnowledge";

const cookieName = "lmx-support-session";

async function sessionToken(password: string) {
  const data = new TextEncoder().encode(`lmx-content-support:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function isAuthenticated(request: Request) {
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword) {
    return false;
  }

  const cookie = request.headers.get("cookie") ?? "";
  const token = await sessionToken(appPassword);
  return cookie.includes(`${cookieName}=${token}`);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    message?: string;
    intake?: IssueIntake;
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  const message = body.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const documentMatches = searchTrainingKnowledge(message, body.intake);
  const localReply = mergeDocumentContextIntoFallback(
    buildFallbackResponse(message, body.intake),
    documentMatches
  );

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      reply: localReply,
      source: documentMatches.length > 0 ? "knowledge" : "local"
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: assistantSystemPrompt },
          {
            role: "system",
            content:
              "Use the uploaded LMX Content Training Module context as the primary source. Answer simply and directly. Prefer short numbered steps. Do not paste long excerpts from the uploaded knowledge. If the context does not contain the answer, ask for the missing module, screen, or workflow."
          },
          {
            role: "user",
            content: `Training context JSON:\n${JSON.stringify(body.intake ?? {}, null, 2)}`
          },
          {
            role: "user",
            content: `Uploaded knowledge matches:\n${buildDocumentContext(documentMatches) || "No relevant uploaded knowledge match found."}`
          },
          ...(body.history ?? []).slice(-8),
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content;

    return NextResponse.json({
      reply: reply || localReply,
      source: reply ? "openai" : documentMatches.length > 0 ? "knowledge" : "local"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      reply: localReply,
      source: documentMatches.length > 0 ? "knowledge" : "local",
      warning: "OpenAI unavailable. Used local knowledge fallback."
    });
  }
}
