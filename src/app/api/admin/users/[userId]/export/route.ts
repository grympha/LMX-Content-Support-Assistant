import { NextResponse } from "next/server";
import { eq, asc, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/schema";

const ADMIN_COOKIE = "lmx-admin-session";

async function adminToken(password: string) {
  const data = new TextEncoder().encode(`lmx-admin:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function isAdmin(request: Request): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD || process.env.APP_PASSWORD || "";
  if (!password) return false;
  const cookie = request.headers.get("cookie") ?? "";
  const token = await adminToken(password);
  return cookie.includes(`${ADMIN_COOKIE}=${token}`);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json(
      { error: "Conversation database is not configured." },
      { status: 503 }
    );
  }

  const { userId } = await params;
  const cleanUserId = (userId ?? "").trim();

  if (!cleanUserId || cleanUserId.length > 255) {
    return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
  }

  try {
    const convRows = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, cleanUserId))
      .orderBy(asc(conversations.createdAt));

    const convIds = convRows.map((c) => c.id);

    const msgRows =
      convIds.length > 0
        ? await db
            .select()
            .from(messages)
            .where(inArray(messages.conversationId, convIds))
            .orderBy(asc(messages.createdAt))
        : [];

    const msgsByConv = new Map<string, typeof msgRows>();
    for (const msg of msgRows) {
      const bucket = msgsByConv.get(msg.conversationId) ?? [];
      bucket.push(msg);
      msgsByConv.set(msg.conversationId, bucket);
    }

    return NextResponse.json({
      user: cleanUserId,
      conversationCount: convRows.length,
      messageCount: msgRows.length,
      conversations: convRows.map((c) => ({
        id: c.id,
        title: c.title,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        messages: (msgsByConv.get(c.id) ?? []).map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
      })),
    });
  } catch (err) {
    console.error("[GET /api/admin/users/[userId]/export]", err);
    return NextResponse.json({ error: "Failed to export user history." }, { status: 500 });
  }
}
