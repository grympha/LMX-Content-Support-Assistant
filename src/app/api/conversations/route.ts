import { NextResponse } from "next/server";
import { eq, desc, asc, count, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages as messagesTable } from "@/lib/schema";
import { isAuthenticated, usernameFromRequest } from "@/lib/apiAuth";

const DB_UNAVAILABLE = NextResponse.json(
  { error: "Conversation history is not available. DATABASE_URL is not configured." },
  { status: 503 }
);

// GET /api/conversations
// Returns the conversation list for the current user, sorted by most recently updated.
export async function GET(request: Request) {
  if (!db) return DB_UNAVAILABLE;
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const username = usernameFromRequest(request);
  if (!username) {
    return NextResponse.json({ error: "Username missing from session." }, { status: 400 });
  }

  try {
    const rows = await db
      .select({
        id: conversations.id,
        title: conversations.title,
        createdAt: conversations.createdAt,
        updatedAt: conversations.updatedAt,
      })
      .from(conversations)
      .where(eq(conversations.userId, username))
      .orderBy(desc(conversations.updatedAt));

    return NextResponse.json(rows);
  } catch (err) {
    console.error("[GET /api/conversations]", err);
    return NextResponse.json({ error: "Failed to load conversations." }, { status: 500 });
  }
}

// POST /api/conversations
// Creates a new conversation for the current user.
// Enforces MAX_CONVERSATIONS_PER_USER retention — deletes oldest when limit is reached.
export async function POST(request: Request) {
  if (!db) return DB_UNAVAILABLE;
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const username = usernameFromRequest(request);
  if (!username) {
    return NextResponse.json({ error: "Username missing from session." }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
    messages?: Array<{ role: string; content: string }>;
  };
  const title = body.title?.trim().slice(0, 500) || "New Conversation";

  const MAX = Math.max(
    1,
    parseInt(process.env.MAX_CONVERSATIONS_PER_USER ?? "50", 10) || 50
  );

  try {
    // Enforce retention: delete oldest conversations when the user is at the limit.
    const [{ total }] = await db
      .select({ total: count() })
      .from(conversations)
      .where(eq(conversations.userId, username));

    if (total >= MAX) {
      const overflow = total - MAX + 1;
      const oldest = await db
        .select({ id: conversations.id })
        .from(conversations)
        .where(eq(conversations.userId, username))
        .orderBy(asc(conversations.updatedAt))
        .limit(overflow);

      if (oldest.length > 0) {
        await db
          .delete(conversations)
          .where(inArray(conversations.id, oldest.map((c) => c.id)));
      }
    }

    const [newConv] = await db
      .insert(conversations)
      .values({ userId: username, title })
      .returning();

    // Optionally pre-populate messages (used by FAQ interactions).
    if (body.messages && body.messages.length > 0) {
      const validMessages = body.messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(0, 100)
        .map((m) => ({
          conversationId: newConv.id,
          role: m.role as "user" | "assistant",
          content: String(m.content).slice(0, 50_000),
        }));
      if (validMessages.length > 0) {
        await db.insert(messagesTable).values(validMessages);
      }
    }

    return NextResponse.json(newConv, { status: 201 });
  } catch (err) {
    console.error("[POST /api/conversations]", err);
    return NextResponse.json({ error: "Failed to create conversation." }, { status: 500 });
  }
}
