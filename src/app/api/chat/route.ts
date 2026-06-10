import { NextResponse } from "next/server";
import { assistantSystemPrompt, type IssueIntake } from "@/lib/lmxKnowledge";
import { buildLocalSearchResponse, localMatchesToDocumentContext } from "@/lib/localSearchEngine";
import { logProgressEvent } from "@/lib/progressLog";
import { getPreferredChatProvider } from "@/lib/chatProviders";
import { commonQuestions } from "@/lib/commonQuestions";

const FAQ_STOP_WORDS = new Set([
  "the","a","an","is","are","do","does","did","how","why","what","when","where","who",
  "can","my","i","to","in","on","of","for","with","be","it","this","that","at","by",
  "from","or","and","not","still","if","was","has","have","had","its","get","use",
  "using","will","should","would","could","need","just","also","some","any","but"
]);

function faqTokens(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !FAQ_STOP_WORDS.has(w));
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 99;
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function fuzzyIntersection(msgTokens: string[], faqTokens: string[]): number {
  let count = 0;
  for (const m of msgTokens) {
    for (const f of faqTokens) {
      if (m === f || (m.length >= 7 && f.length >= 7 && levenshtein(m, f) <= 1)) {
        count++;
        break;
      }
    }
  }
  return count;
}

function matchFaq(message: string) {
  const msgToks = faqTokens(message);
  if (msgToks.length === 0) return null;

  let best: (typeof commonQuestions)[number] | null = null;
  let bestScore = 0;

  for (const faq of commonQuestions) {
    const fToks = faqTokens(faq.question);
    if (fToks.length === 0) continue;
    const intersection = fuzzyIntersection(msgToks, fToks);
    if (intersection < 2) continue;
    // F1: harmonic mean of precision and recall — penalises long FAQ questions
    // that share only a few generic words with the query
    const precision = intersection / msgToks.length;
    const recall = intersection / fToks.length;
    const f1 = (2 * precision * recall) / (precision + recall);
    if (f1 >= 0.5 && f1 > bestScore) {
      bestScore = f1;
      best = faq;
    }
  }

  return best;
}

const cookieName = "lmx-support-session";
const userCookieName = "lmx-support-user";
const maxAttachmentCharacters = 12000;

type ChatAttachment = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
  text?: string;
};

type OpenAiMessage = { role: "system" | "user" | "assistant"; content: string };

async function callOpenAI(messages: OpenAiMessage[]) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      messages
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  return (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
}

async function callClaude(messages: OpenAiMessage[]) {
  const url = process.env.CLAUDE_API_URL ?? "https://api.anthropic.com/v1/messages";

  // Anthropic's Messages API takes system as a top-level string, not a message role
  const systemParts = messages.filter(m => m.role === "system").map(m => m.content);
  const system = systemParts.join("\n\n") || undefined;

  // Anthropic requires strictly alternating user/assistant roles — merge consecutive same-role messages
  const nonSystem = messages.filter(m => m.role !== "system");
  const anthropicMessages: { role: "user" | "assistant"; content: string }[] = [];
  for (const msg of nonSystem) {
    const last = anthropicMessages[anthropicMessages.length - 1];
    if (last && last.role === msg.role) {
      last.content += "\n\n" + msg.content;
    } else {
      anthropicMessages.push({ role: msg.role as "user" | "assistant", content: msg.content });
    }
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CLAUDE_API_KEY ?? "",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL ?? "claude-haiku-4-5",
      max_tokens: 2048,
      system,
      messages: anthropicMessages
    })
  });

  if (!response.ok) {
    throw new Error(`Claude request failed with ${response.status}`);
  }

  const data = await response.json() as { content?: Array<{ type: string; text: string }> };
  const text = data.content?.find(block => block.type === "text")?.text ?? null;

  // Normalize to OpenAI-compatible shape so downstream parsing is unchanged
  return { choices: [{ message: { content: text } }] };
}

async function callMistral(messages: OpenAiMessage[]) {
  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.MISTRAL_MODEL ?? "mistral-small-latest",
      temperature: 0.2,
      messages
    })
  });

  if (!response.ok) {
    throw new Error(`Mistral request failed with ${response.status}`);
  }

  return (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
}

function readCookie(cookieHeader: string, name: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function usernameFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const encodedUsername = readCookie(cookie, userCookieName) ?? "";
  return encodedUsername ? decodeURIComponent(encodedUsername) : "";
}

function dataUrlToBuffer(dataUrl: string) {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Buffer.from(base64, "base64");
}

function isImageAttachment(attachment: ChatAttachment) {
  return attachment.type.startsWith("image/") && Boolean(attachment.dataUrl);
}

async function extractAttachmentText(attachment: ChatAttachment) {
  if (attachment.text) {
    return attachment.text;
  }

  if (!attachment.dataUrl) {
    return "";
  }

  const lowerName = attachment.name.toLowerCase();
  const buffer = dataUrlToBuffer(attachment.dataUrl);

  try {
    if (attachment.type === "application/pdf" || lowerName.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default as (input: Buffer) => Promise<{ text?: string }>;
      const result = await pdfParse(buffer);
      return result.text ?? "";
    }

    if (
      attachment.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lowerName.endsWith(".docx")
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value ?? "";
    }
  } catch (error) {
    console.error(`Unable to extract attachment text from ${attachment.name}`, error);
    return "";
  }

  return "";
}

async function buildAttachmentContext(attachments: ChatAttachment[] = []) {
  const textAttachments = attachments.filter((attachment) => !isImageAttachment(attachment));
  const extracted = await Promise.all(
    textAttachments.map(async (attachment) => {
      const text = (await extractAttachmentText(attachment)).trim();

      if (!text) {
        return `File: ${attachment.name}\nNo readable text could be extracted.`;
      }

      return `File: ${attachment.name}\nType: ${attachment.type || "unknown"}\nContent:\n${text.slice(0, maxAttachmentCharacters)}`;
    })
  );

  return extracted.join("\n\n---\n\n");
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
    attachments?: ChatAttachment[];
    intake?: IssueIntake;
    history?: Array<{ role: "user" | "assistant"; content: string }>;
  };

  const message = body.message?.trim() ?? "";
  const attachments = (body.attachments ?? []).slice(0, 3);

  if (!message && attachments.length === 0) {
    return NextResponse.json({ error: "Message or attachment is required." }, { status: 400 });
  }

  const username = usernameFromRequest(request);
  const attachmentContext = await buildAttachmentContext(attachments);
  const imageAttachments = attachments.filter(isImageAttachment);
  const messageForSearch = [message, attachmentContext].filter(Boolean).join("\n\n");

  // Return FAQ answer directly when the question clearly matches a known FAQ entry
  if (!attachmentContext) {
    const faqMatch = matchFaq(messageForSearch || message);
    if (faqMatch) {
      await logProgressEvent({
        eventType: "quick_answer_selected",
        username,
        fullName: body.intake?.clientTenant,
        question: message
      });
      return NextResponse.json({
        reply: faqMatch.answer,
        source: "knowledge",
        sourceLinks: faqMatch.sourceLinks ?? [],
        sourceNotes: []
      });
    }
  }

  const localSearch = buildLocalSearchResponse(messageForSearch || message, body.intake);
  const localKnowledgeContext = localMatchesToDocumentContext(localSearch.matches);

  await logProgressEvent({
    eventType: "question_asked",
    username,
    fullName: body.intake?.clientTenant,
    topic: body.intake?.issueCategory || undefined,
    question: attachments.length > 0 ? `${message || "Attachment review"} | Files: ${attachments.map((attachment) => attachment.name).join(", ")}` : message
  });

  const imageAttachmentNote =
    imageAttachments.length > 0
      ? "\n\nImage note\n- Image attachments need an AI provider for visual analysis. I can still answer from the text question and local training knowledge."
      : "";
  const localReply = `${localSearch.answer}${imageAttachmentNote}`;
  const provider = getPreferredChatProvider();

  if (provider === "local") {
    if (imageAttachments.length > 0 && !message && !attachmentContext) {
      return NextResponse.json({
        reply: `Image Attachment Review\n\nImage attachments require OPENAI_API_KEY or CLAUDE_API_KEY for visual analysis. Please type what is shown in the screenshot or describe the issue, and I will search the local LMX Content training knowledge without using any API key.`,
        source: "local",
        sourceLinks: [],
        sourceNotes: []
      });
    }

    return NextResponse.json({
      reply: localReply,
      source: localSearch.confidence === "low" ? "local" : "knowledge",
      sourceLinks: localSearch.sourceLinks,
      sourceNotes: localSearch.sourceNotes
    });
  }

  const messages: OpenAiMessage[] = [
    { role: "system", content: assistantSystemPrompt },
    {
      role: "system",
      content:
        "Use the LMX Content Training Module context and any attached file context as your primary sources. Answer naturally and conversationally — no rigid templates or formal headers. If neither the training knowledge nor attachments contain a clear answer, honestly say so and ask for more context rather than guessing."
    },
    {
      role: "user",
      content: `Training context JSON:\n${JSON.stringify(body.intake ?? {}, null, 2)}`
    },
    {
      role: "user",
      content: `Uploaded knowledge matches:\n${localKnowledgeContext || "No relevant uploaded knowledge match found."}`
    },
    {
      role: "user",
      content: `Attached file text context:\n${attachmentContext || "No readable text attachment was provided."}`
    },
    ...(body.history ?? []).slice(-8),
    {
      role: "user",
      content: imageAttachments.length > 0
        ? `${message || "Please review the attached file and answer based on the LMX Content training context."}\n\nAttached images are present but require a visual analysis provider.`
        : message || "Please review the attached file and answer based on the LMX Content training context."
    }
  ];

  async function fallbackToLocal(errorMessage: string) {
    console.error(errorMessage);
    return NextResponse.json({
      reply: localReply,
      source: localSearch.confidence === "low" ? "local" : "knowledge",
      sourceLinks: localSearch.sourceLinks,
      sourceNotes: localSearch.sourceNotes,
      warning: `AI unavailable. Used local knowledge fallback.`
    });
  }

  try {
    const data =
      provider === "claude"
        ? await callClaude(messages)
        : provider === "mistral"
          ? await callMistral(messages)
          : await callOpenAI(messages);

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return await fallbackToLocal(`No reply returned from ${provider}.`);
    }

    return NextResponse.json({
      reply,
      source: provider,
      sourceLinks: localSearch.sourceLinks,
      sourceNotes: localSearch.sourceNotes
    });
  } catch (error) {
    console.error(error);

    if (provider === "claude") {
      if (process.env.OPENAI_API_KEY) {
        try {
          const data = await callOpenAI(messages);
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply, source: "openai", sourceLinks: localSearch.sourceLinks, sourceNotes: localSearch.sourceNotes });
        } catch (fallbackError) { console.error(fallbackError); }
      }
      if (process.env.MISTRAL_API_KEY) {
        try {
          const data = await callMistral(messages);
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply, source: "mistral", sourceLinks: localSearch.sourceLinks, sourceNotes: localSearch.sourceNotes });
        } catch (fallbackError) { console.error(fallbackError); }
      }
    }

    if (provider === "openai" && process.env.MISTRAL_API_KEY) {
      try {
        const data = await callMistral(messages);
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return NextResponse.json({ reply, source: "mistral", sourceLinks: localSearch.sourceLinks, sourceNotes: localSearch.sourceNotes });
      } catch (fallbackError) { console.error(fallbackError); }
    }

    return await fallbackToLocal(`AI request failed for provider ${provider}.`);
  }
}
