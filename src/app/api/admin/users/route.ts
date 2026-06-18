import { NextResponse } from "next/server";
import { eq, count, max, desc, sql } from "drizzle-orm";
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

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json(
      { error: "Conversation database is not configured." },
      { status: 503 }
    );
  }

  try {
    const convRows = await db
      .select({
        userId: conversations.userId,
        conversationCount: count(conversations.id),
        latestActivity: max(conversations.updatedAt),
      })
      .from(conversations)
      .groupBy(conversations.userId)
      .orderBy(desc(max(conversations.updatedAt)));

    const msgRows = await db
      .select({
        userId: conversations.userId,
        messageCount: sql<string>`cast(count(${messages.id}) as text)`,
      })
      .from(conversations)
      .leftJoin(messages, eq(messages.conversationId, conversations.id))
      .groupBy(conversations.userId);

    const msgByUser = new Map(msgRows.map((r) => [r.userId, parseInt(r.messageCount ?? "0", 10)]));

    return NextResponse.json(
      convRows.map((r) => ({
        userId: r.userId,
        conversationCount: Number(r.conversationCount),
        messageCount: msgByUser.get(r.userId) ?? 0,
        latestActivity: r.latestActivity ? r.latestActivity.toISOString() : null,
      }))
    );
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return NextResponse.json({ error: "Failed to load user stats." }, { status: 500 });
  }
}
