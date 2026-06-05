import { NextResponse } from "next/server";
import { assistantSystemPrompt, type IssueIntake } from "@/lib/lmxKnowledge";
import { buildLocalSearchResponse, localMatchesToDocumentContext } from "@/lib/localSearchEngine";
import { logProgressEvent } from "@/lib/progressLog";
import { getPreferredChatProvider } from "@/lib/chatProviders";

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
        sourceLinks: []
      });
    }

    return NextResponse.json({
      reply: localReply,
      source: localSearch.confidence === "low" ? "local" : "knowledge",
      sourceLinks: localSearch.sourceLinks
    });
  }

  const messages: OpenAiMessage[] = [
    { role: "system", content: assistantSystemPrompt },
    {
      role: "system",
      content:
        "Use the uploaded LMX Content Training Module context and any attached file context as the primary sources. Answer using the compact topic-card template: topic title, one short explanation paragraph, then 'Key steps' with bullet points. Do not paste long excerpts from the uploaded knowledge or attached files. If neither the training knowledge nor attachments contain a clear answer, return the approved fallback response instead of guessing."
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
      warning: `AI unavailable. Used local knowledge fallback.`
    });
  }

  try {
    const data =
      provider === "claude"
        ? await callClaude(messages)
        : await callOpenAI(messages);

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return await fallbackToLocal(`No reply returned from ${provider}.`);
    }

    return NextResponse.json({
      reply,
      source: provider,
      sourceLinks: localSearch.sourceLinks
    });
  } catch (error) {
    console.error(error);

    if (provider === "claude" && process.env.OPENAI_API_KEY) {
      try {
        const data = await callOpenAI(messages);
        const reply = data.choices?.[0]?.message?.content;

        if (reply) {
          return NextResponse.json({
            reply,
            source: "openai",
            sourceLinks: localSearch.sourceLinks
          });
        }
      } catch (fallbackError) {
        console.error(fallbackError);
      }
    }

    return await fallbackToLocal(`AI request failed for provider ${provider}.`);
  }
}
