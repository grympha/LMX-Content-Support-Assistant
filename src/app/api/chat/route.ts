import { NextResponse } from "next/server";
import { assistantSystemPrompt, type IssueIntake } from "@/lib/lmxKnowledge";
import { buildLocalSearchResponse, localMatchesToDocumentContext } from "@/lib/localSearchEngine";
import { logProgressEvent } from "@/lib/progressLog";
import { getPreferredChatProvider } from "@/lib/chatProviders";
import { commonQuestions } from "@/lib/commonQuestions";
import { db } from "@/lib/db";
import { conversations, messages as dbMessages } from "@/lib/schema";
import { generateTitle, truncateMessage } from "@/lib/conversationUtils";
import { eq, and, count as dbCount } from "drizzle-orm";
import { isAuthenticated, usernameFromRequest } from "@/lib/apiAuth";
import { findApprovedLearnedAnswer, incrementLearnedAnswerReuse, normalizeQuestion } from "@/lib/learnedAnswers";

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

const maxAttachmentCharacters = 12000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  // Anthropic's Messages API takes system as a top-level param, not a message role.
  // Pass it as a content-block array so we can add cache_control — the system prompt
  // is identical on every request, making it the best candidate for prompt caching.
  // No extra headers needed; prompt caching is GA on the Anthropic API.
  const systemParts = messages.filter(m => m.role === "system").map(m => m.content);
  const systemText = systemParts.join("\n\n");
  const system = systemText
    ? [{ type: "text" as const, text: systemText, cache_control: { type: "ephemeral" as const } }]
    : undefined;

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

async function saveExchange(
  convId: string | null,
  username: string,
  userContent: string,
  assistantContent: string,
  assistantMsgId: string
): Promise<void> {
  if (!db || !convId || !username) return;
  try {
    const [conv] = await db
      .select({ id: conversations.id, title: conversations.title })
      .from(conversations)
      .where(and(eq(conversations.id, convId), eq(conversations.userId, username)));
    if (!conv) {
      console.error("[saveExchange] Conversation not found — convId:", convId, "user:", username);
      return;
    }

    const [{ total }] = await db
      .select({ total: dbCount() })
      .from(dbMessages)
      .where(eq(dbMessages.conversationId, convId));

    const isFirst = total === 0;

    await db.insert(dbMessages).values({ conversationId: convId, role: "user", content: userContent });
    await db.insert(dbMessages).values({ id: assistantMsgId, conversationId: convId, role: "assistant", content: assistantContent });

    const updates: { updatedAt: Date; title?: string } = { updatedAt: new Date() };
    if (isFirst) updates.title = generateTitle(userContent);
    await db
      .update(conversations)
      .set(updates)
      .where(and(eq(conversations.id, convId), eq(conversations.userId, username)));
  } catch (err) {
    console.error("[saveExchange]", err);
  }
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
    conversationId?: string;
  };

  const message = truncateMessage(body.message?.trim() ?? "");
  const attachments = (body.attachments ?? []).slice(0, 3);

  if (!message && attachments.length === 0) {
    return NextResponse.json({ error: "Message or attachment is required." }, { status: 400 });
  }

  const username = await usernameFromRequest(request);
  const assistantMsgId = crypto.randomUUID();
  const rawConvId = (body.conversationId ?? "").trim();
  const validConvId = rawConvId && UUID_REGEX.test(rawConvId) ? rawConvId : null;
  const attachmentContext = await buildAttachmentContext(attachments);
  const imageAttachments = attachments.filter(isImageAttachment);

  // Include recent history in search so short follow-ups (e.g. "after that") find contextually relevant knowledge
  const recentHistoryText = (body.history ?? [])
    .slice(-4)
    .map(m => m.content)
    .join("\n");
  const messageForSearch = [recentHistoryText, message, attachmentContext].filter(Boolean).join("\n\n");

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
      void saveExchange(validConvId, username, message, faqMatch.answer, assistantMsgId);
      return NextResponse.json({
        reply: faqMatch.answer,
        source: "knowledge",
        sourceLinks: faqMatch.sourceLinks ?? [],
        sourceNotes: [],
        assistantMessageId: validConvId && db ? assistantMsgId : undefined,
      });
    }
  }

  // Check approved learned answers before building local search and calling AI
  if (!attachmentContext) {
    const learned = await findApprovedLearnedAnswer(normalizeQuestion(message));
    if (learned) {
      await logProgressEvent({
        eventType: "question_asked",
        username,
        fullName: body.intake?.clientTenant,
        topic: body.intake?.issueCategory || undefined,
        question: message,
      });
      void incrementLearnedAnswerReuse(learned.id);
      void saveExchange(validConvId, username, message, learned.response, assistantMsgId);
      return NextResponse.json({
        reply: learned.response,
        source: "learned_answer",
        sourceLinks: [],
        sourceNotes: [],
        assistantMessageId: validConvId && db ? assistantMsgId : undefined,
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
      const imgReply = `Image Attachment Review\n\nImage attachments require OPENAI_API_KEY or CLAUDE_API_KEY for visual analysis. Please type what is shown in the screenshot or describe the issue, and I will search the local LMX Content training knowledge without using any API key.`;
      void saveExchange(validConvId, username, message, imgReply, assistantMsgId);
      return NextResponse.json({
        reply: imgReply,
        source: "local",
        sourceLinks: [],
        sourceNotes: [],
        assistantMessageId: validConvId && db ? assistantMsgId : undefined,
      });
    }

    void saveExchange(validConvId, username, message, localReply, assistantMsgId);
    return NextResponse.json({
      reply: localReply,
      source: localSearch.confidence === "low" ? "local" : "knowledge",
      sourceLinks: localSearch.sourceLinks,
      sourceNotes: localSearch.sourceNotes,
      assistantMessageId: validConvId && db ? assistantMsgId : undefined,
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
    void saveExchange(validConvId, username, message, localReply, assistantMsgId);
    return NextResponse.json({
      reply: localReply,
      source: localSearch.confidence === "low" ? "local" : "knowledge",
      sourceLinks: localSearch.sourceLinks,
      sourceNotes: localSearch.sourceNotes,
      warning: `AI unavailable. Used local knowledge fallback.`,
      assistantMessageId: validConvId && db ? assistantMsgId : undefined,
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

    void saveExchange(validConvId, username, message, reply, assistantMsgId);
    return NextResponse.json({
      reply,
      source: provider,
      sourceLinks: localSearch.sourceLinks,
      sourceNotes: localSearch.sourceNotes,
      assistantMessageId: validConvId && db ? assistantMsgId : undefined,
    });
  } catch (error) {
    console.error(error);

    if (provider === "claude") {
      if (process.env.OPENAI_API_KEY) {
        try {
          const data = await callOpenAI(messages);
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            void saveExchange(validConvId, username, message, reply, assistantMsgId);
            return NextResponse.json({ reply, source: "openai", sourceLinks: localSearch.sourceLinks, sourceNotes: localSearch.sourceNotes, assistantMessageId: validConvId && db ? assistantMsgId : undefined });
          }
        } catch (fallbackError) { console.error(fallbackError); }
      }
      if (process.env.MISTRAL_API_KEY) {
        try {
          const data = await callMistral(messages);
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            void saveExchange(validConvId, username, message, reply, assistantMsgId);
            return NextResponse.json({ reply, source: "mistral", sourceLinks: localSearch.sourceLinks, sourceNotes: localSearch.sourceNotes, assistantMessageId: validConvId && db ? assistantMsgId : undefined });
          }
        } catch (fallbackError) { console.error(fallbackError); }
      }
    }

    if (provider === "openai" && process.env.MISTRAL_API_KEY) {
      try {
        const data = await callMistral(messages);
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          void saveExchange(validConvId, username, message, reply, assistantMsgId);
          return NextResponse.json({ reply, source: "mistral", sourceLinks: localSearch.sourceLinks, sourceNotes: localSearch.sourceNotes, assistantMessageId: validConvId && db ? assistantMsgId : undefined });
        }
      } catch (fallbackError) { console.error(fallbackError); }
    }

    return await fallbackToLocal(`AI request failed for provider ${provider}.`);
  }
}
