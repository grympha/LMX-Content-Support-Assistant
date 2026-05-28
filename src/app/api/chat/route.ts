import { NextResponse } from "next/server";
import {
  assistantSystemPrompt,
  buildFallbackResponse,
  lmxKnowledge,
  type IssueIntake
} from "@/lib/lmxKnowledge";
import {
  buildDocumentContext,
  mergeDocumentContextIntoFallback,
  searchTrainingKnowledge,
  type DocumentKnowledgeMatch
} from "@/lib/documentKnowledge";

const cookieName = "lmx-support-session";

const unclearFallback = `I could not find a clear answer based on the available LMX Content training information.

Please try asking a more specific question, for example:
- How do I generate Playlogs?
- How do I restart Windows player pairing?
- Why is the Default Playlist showing?

- What formats are supported?

For further assistance, please contact our Support Helpdesk at support@movingwalls.com.`;

const highConfidencePhrases = [
  "black screen",
  "default playlist",
  "playlog",
  "playlogs",
  "pair device",
  "pairing",
  "verification code",
  "device offline",
  "offline device",
  "create network",
  "create location",
  "create playlist",
  "create layout",
  "create device",
  "publish content",
  "publishing",
  "schedule content",
  "scheduling",
  "main storage",
  "storage",
  "upload content",
  "programmatic",
  "vast",
  "webview",
  "supported operating",
  "hardware",
  "supported formats",
  "formats supported",
  "file formats",
  "media formats",
  "install player",
  "installation",
  "pull to content",
  "windows player",
  "user management"
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s/+.-]/g, " ").replace(/\s+/g, " ").trim();
}

function keywordMatches(haystack: string, keyword: string) {
  const normalizedKeyword = normalize(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  if (normalizedKeyword.includes(" ") || normalizedKeyword.includes("/")) {
    return haystack.includes(normalizedKeyword);
  }

  return new RegExp(`(^|\\s)${normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`).test(haystack);
}

function hasStrongDocumentMatch(documentMatches: DocumentKnowledgeMatch[], hasStrongPhrase: boolean) {
  return hasStrongPhrase && documentMatches.some((match) => match.score >= 2);
}

function hasConfidentKnowledgeMatch(message: string, intake: IssueIntake | undefined, documentMatches: DocumentKnowledgeMatch[]) {
  if (intake?.issueCategory && intake.issueCategory !== "Other") {
    return true;
  }

  const normalizedMessage = normalize(message);
  const hasStrongPhrase = highConfidencePhrases.some((phrase) => normalizedMessage.includes(phrase));
  const scored = lmxKnowledge
    .map((entry) => ({
      entry,
      score: entry.keywords.reduce((total, keyword) => total + (keywordMatches(normalizedMessage, keyword) ? 1 : 0), 0)
    }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];

  if (!best || best.score === 0) {
    return hasStrongDocumentMatch(documentMatches, hasStrongPhrase);
  }

  if (best.entry.category === "Schedule Content" && !/\bschedul(e|ed|ing)?\b|\bcampaign\b/.test(normalizedMessage)) {
    return false;
  }

  if (best.score >= 2) {
    return true;
  }

  if (best.score === 1 && hasStrongPhrase) {
    return true;
  }

  return hasStrongDocumentMatch(documentMatches, hasStrongPhrase);
}

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

  if (!hasConfidentKnowledgeMatch(message, body.intake, documentMatches)) {
    return NextResponse.json({
      reply: unclearFallback,
      source: "local"
    });
  }

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
              "Use the uploaded LMX Content Training Module context as the primary source. Answer using the compact topic-card template: topic title, one short explanation paragraph, then 'Key steps' with bullet points. Do not paste long excerpts from the uploaded knowledge. If the context does not contain the answer, return the approved fallback response instead of guessing."
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
