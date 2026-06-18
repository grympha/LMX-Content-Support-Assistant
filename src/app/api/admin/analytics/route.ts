import { NextResponse } from "next/server";
import { count, desc, gte, sql } from "drizzle-orm";
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

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  try {
    const [convTotals] = await db
      .select({ totalConversations: count(conversations.id) })
      .from(conversations);

    const [msgTotals] = await db
      .select({ totalMessages: count(messages.id) })
      .from(messages);

    const [userCount] = await db
      .select({ totalUsers: sql<number>`count(distinct ${conversations.userId})` })
      .from(conversations);

    const [convsToday] = await db
      .select({ conversationsToday: count(conversations.id) })
      .from(conversations)
      .where(gte(conversations.createdAt, todayStart));

    const [msgsToday] = await db
      .select({ messagesToday: count(messages.id) })
      .from(messages)
      .where(gte(messages.createdAt, todayStart));

    const [topUser] = await db
      .select({
        userId: conversations.userId,
        conversationCount: count(conversations.id),
      })
      .from(conversations)
      .groupBy(conversations.userId)
      .orderBy(desc(count(conversations.id)))
      .limit(1);

    return NextResponse.json({
      totalUsers: Number(userCount.totalUsers),
      totalConversations: Number(convTotals.totalConversations),
      totalMessages: Number(msgTotals.totalMessages),
      conversationsToday: Number(convsToday.conversationsToday),
      messagesToday: Number(msgsToday.messagesToday),
      mostActiveUser: topUser
        ? { userId: topUser.userId, conversationCount: Number(topUser.conversationCount) }
        : null,
    });
  } catch (err) {
    console.error("[GET /api/admin/analytics]", err);
    return NextResponse.json({ error: "Failed to load analytics." }, { status: 500 });
  }
}
