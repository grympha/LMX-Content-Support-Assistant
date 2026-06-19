import { NextResponse } from "next/server";
import { eq, count, max, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages, userProgress, assistantFeedback } from "@/lib/schema";

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
    const [convRows, msgRows, progressRows, feedbackRows] = await Promise.all([
      db
        .select({
          userId: conversations.userId,
          conversationCount: count(conversations.id),
          latestActivity: max(conversations.updatedAt),
        })
        .from(conversations)
        .groupBy(conversations.userId)
        .orderBy(desc(max(conversations.updatedAt))),

      db
        .select({
          userId: conversations.userId,
          messageCount: sql<string>`cast(count(${messages.id}) as text)`,
        })
        .from(conversations)
        .leftJoin(messages, eq(messages.conversationId, conversations.id))
        .groupBy(conversations.userId),

      // Topics completed per user from user_progress
      db
        .select({
          username: userProgress.username,
          topicsCompleted: sql<number>`COALESCE(array_length(${userProgress.completedTopics}, 1), 0)`,
        })
        .from(userProgress)
        .catch(() => [] as Array<{ username: string; topicsCompleted: number }>),

      // Feedback counts per user from assistant_feedback
      db
        .select({
          username: assistantFeedback.username,
          goodFeedback: sql<number>`SUM(CASE WHEN ${assistantFeedback.rating} = 'good' THEN 1 ELSE 0 END)`,
          badFeedback: sql<number>`SUM(CASE WHEN ${assistantFeedback.rating} = 'bad' THEN 1 ELSE 0 END)`,
        })
        .from(assistantFeedback)
        .groupBy(assistantFeedback.username)
        .catch(() => [] as Array<{ username: string; goodFeedback: number; badFeedback: number }>),
    ]);

    // Normalize all keys to lowercase so mixed-case historical data joins correctly
    const msgByUser = new Map(msgRows.map((r) => [r.userId.toLowerCase(), parseInt(r.messageCount ?? "0", 10)]));
    const progressByUser = new Map(
      (progressRows as Array<{ username: string; topicsCompleted: number }>).map((r) => [
        r.username.toLowerCase(),
        Number(r.topicsCompleted ?? 0),
      ])
    );
    const feedbackByUser = new Map(
      (feedbackRows as Array<{ username: string; goodFeedback: number; badFeedback: number }>).map(
        (r) => [r.username.toLowerCase(), { good: Number(r.goodFeedback ?? 0), bad: Number(r.badFeedback ?? 0) }]
      )
    );

    return NextResponse.json(
      convRows.map((r) => ({
        userId: r.userId.toLowerCase(),
        conversationCount: Number(r.conversationCount),
        messageCount: msgByUser.get(r.userId.toLowerCase()) ?? 0,
        latestActivity: r.latestActivity ? r.latestActivity.toISOString() : null,
        topicsCompleted: progressByUser.get(r.userId.toLowerCase()) ?? 0,
        goodFeedback: feedbackByUser.get(r.userId.toLowerCase())?.good ?? 0,
        badFeedback: feedbackByUser.get(r.userId.toLowerCase())?.bad ?? 0,
      }))
    );
  } catch (err) {
    console.error("[GET /api/admin/users]", err);
    return NextResponse.json({ error: "Failed to load user stats." }, { status: 500 });
  }
}
