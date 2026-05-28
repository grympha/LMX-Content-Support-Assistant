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
import { logProgressEvent } from "@/lib/progressLog";

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
  const documentMatches = searchTrainingKnowledge(messageForSearch, body.intake);

  await logProgressEvent({
    eventType: "question_asked",
    username,
    fullName: body.intake?.clientTenant,
    topic: body.intake?.issueCategory || undefined,
    question: attachments.length > 0 ? `${message || "Attachment review"} | Files: ${attachments.map((attachment) => attachment.name).join(", ")}` : message
  });

  if (!attachmentContext && imageAttachments.length === 0 && !hasConfidentKnowledgeMatch(message, body.intake, documentMatches)) {
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
    if (attachmentContext || imageAttachments.length > 0) {
      const attachmentNote = imageAttachments.length > 0
        ? "\n\nImage attachments require `OPENAI_API_KEY` for visual analysis."
        : "";

      return NextResponse.json({
        reply: `Attached File Review\n\nI received the attached file, but detailed file-based answering requires OpenAI integration to be enabled.\n\nExtracted readable text preview:\n${attachmentContext || "No readable text was extracted from the attachment."}${attachmentNote}\n\nKey steps\n- Add `OPENAI_API_KEY` in Render if you want the assistant to analyze attached files deeply\n- For PDF/DOCX/CSV, ask a specific question about the file content\n- For screenshots or images, enable OpenAI vision support through the API key`,
        source: "local"
      });
    }

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
              "Use the uploaded LMX Content Training Module context and any attached file context as the primary sources. Answer using the compact topic-card template: topic title, one short explanation paragraph, then 'Key steps' with bullet points. Do not paste long excerpts from the uploaded knowledge or attached files. If neither the training knowledge nor attachments contain a clear answer, return the approved fallback response instead of guessing."
          },
          {
            role: "user",
            content: `Training context JSON:\n${JSON.stringify(body.intake ?? {}, null, 2)}`
          },
          {
            role: "user",
            content: `Uploaded knowledge matches:\n${buildDocumentContext(documentMatches) || "No relevant uploaded knowledge match found."}`
          },
          {
            role: "user",
            content: `Attached file text context:\n${attachmentContext || "No readable text attachment was provided."}`
          },
          ...(body.history ?? []).slice(-8),
          {
            role: "user",
            content:
              imageAttachments.length > 0
                ? [
                    { type: "text", text: message || "Please review the attached file and answer based on the LMX Content training context." },
                    ...imageAttachments.map((attachment) => ({
                      type: "image_url",
                      image_url: { url: attachment.dataUrl }
                    }))
                  ]
                : message || "Please review the attached file and answer based on the LMX Content training context."
          }
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
