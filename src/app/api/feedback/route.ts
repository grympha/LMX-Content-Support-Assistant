import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { assistantFeedback } from "@/lib/schema";
import { isAuthenticated, usernameFromRequest } from "@/lib/apiAuth";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_RATINGS = new Set(["good", "bad"]);

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json(
      { error: "Feedback storage is not available. DATABASE_URL is not configured." },
      { status: 503 }
    );
  }

  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const username = await usernameFromRequest(request);
  if (!username) {
    return NextResponse.json({ error: "Username missing from session." }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    conversationId?: string;
    messageId?: string;
    question?: string;
    response?: string;
    rating?: string;
    aiProvider?: string;
    sources?: string[];
  };

  const { rating, conversationId, messageId, aiProvider, sources } = body;
  const question = (body.question ?? "").slice(0, 10000);
  const response = (body.response ?? "").slice(0, 50000);

  if (!rating || !VALID_RATINGS.has(rating)) {
    return NextResponse.json(
      { error: "rating must be 'good' or 'bad'." },
      { status: 400 }
    );
  }

  const validConvId =
    conversationId && UUID_REGEX.test(conversationId) ? conversationId : null;
  const validMsgId =
    messageId && UUID_REGEX.test(messageId) ? messageId : null;

  try {
    if (validMsgId) {
      const existing = await db
        .select({ id: assistantFeedback.id })
        .from(assistantFeedback)
        .where(and(eq(assistantFeedback.username, username), eq(assistantFeedback.messageId, validMsgId)))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(assistantFeedback)
          .set({ rating, updatedAt: new Date() })
          .where(eq(assistantFeedback.id, existing[0].id));
        return NextResponse.json({ ok: true, action: "updated" });
      }
    }

    await db.insert(assistantFeedback).values({
      username,
      conversationId: validConvId ?? undefined,
      messageId: validMsgId ?? undefined,
      question: question || undefined,
      response: response || undefined,
      rating,
      aiProvider: aiProvider?.slice(0, 50) || undefined,
      sources: sources?.map((s) => s.slice(0, 500)).slice(0, 20) || undefined,
    });

    return NextResponse.json({ ok: true, action: "inserted" });
  } catch (err) {
    console.error("[POST /api/feedback]", err);
    return NextResponse.json({ error: "Failed to save feedback." }, { status: 500 });
  }
}
