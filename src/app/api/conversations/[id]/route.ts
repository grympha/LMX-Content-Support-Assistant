import { NextResponse } from "next/server";
import { eq, and, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";
import { isAuthenticated, usernameFromRequest } from "@/lib/apiAuth";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DB_UNAVAILABLE = NextResponse.json(
  { error: "Conversation history is not available. DATABASE_URL is not configured." },
  { status: 503 }
);

type Params = Promise<{ id: string }>;

// GET /api/conversations/[id]
// Returns a conversation and all its messages.
// Enforces row-level authorization: user_id must match the current session username.
export async function GET(request: Request, { params }: { params: Params }) {
  if (!db) return DB_UNAVAILABLE;
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid conversation ID." }, { status: 400 });
  }

  const username = await usernameFromRequest(request);
  if (!username) {
    return NextResponse.json({ error: "Username missing from session." }, { status: 400 });
  }

  try {
    const [conv] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, username)));

    if (!conv) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    const msgs = await db
      .select({
        id: messages.id,
        role: messages.role,
        content: messages.content,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    return NextResponse.json({ ...conv, messages: msgs });
  } catch (err) {
    console.error("[GET /api/conversations/[id]]", err);
    return NextResponse.json({ error: "Failed to load conversation." }, { status: 500 });
  }
}

// PATCH /api/conversations/[id]
// Renames a conversation. Enforces row-level authorization.
export async function PATCH(request: Request, { params }: { params: Params }) {
  if (!db) return DB_UNAVAILABLE;
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid conversation ID." }, { status: 400 });
  }

  const username = await usernameFromRequest(request);
  if (!username) {
    return NextResponse.json({ error: "Username missing from session." }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as { title?: string };
  const newTitle = body.title?.trim().slice(0, 500);
  if (!newTitle) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  try {
    const [updated] = await db
      .update(conversations)
      .set({ title: newTitle, updatedAt: new Date() })
      .where(and(eq(conversations.id, id), eq(conversations.userId, username)))
      .returning({ id: conversations.id });

    if (!updated) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/conversations/[id]]", err);
    return NextResponse.json({ error: "Failed to rename conversation." }, { status: 500 });
  }
}

// DELETE /api/conversations/[id]
// Deletes a conversation and all its messages (cascade). Enforces row-level authorization.
export async function DELETE(request: Request, { params }: { params: Params }) {
  if (!db) return DB_UNAVAILABLE;
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid conversation ID." }, { status: 400 });
  }

  const username = await usernameFromRequest(request);
  if (!username) {
    return NextResponse.json({ error: "Username missing from session." }, { status: 400 });
  }

  try {
    const [deleted] = await db
      .delete(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, username)))
      .returning({ id: conversations.id });

    if (!deleted) {
      return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/conversations/[id]]", err);
    return NextResponse.json({ error: "Failed to delete conversation." }, { status: 500 });
  }
}
