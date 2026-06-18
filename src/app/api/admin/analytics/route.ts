import { NextResponse } from "next/server";
import { count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages, trainingEvents, userProgress } from "@/lib/schema";

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
    const [convTotals, msgTotals, userCount, convsToday, msgsToday, topUser] = await Promise.all([
      db.select({ totalConversations: count(conversations.id) }).from(conversations),
      db.select({ totalMessages: count(messages.id) }).from(messages),
      db.select({ totalUsers: sql<number>`count(distinct ${conversations.userId})` }).from(conversations),
      db
        .select({ conversationsToday: count(conversations.id) })
        .from(conversations)
        .where(gte(conversations.createdAt, todayStart)),
      db
        .select({ messagesToday: count(messages.id) })
        .from(messages)
        .where(gte(messages.createdAt, todayStart)),
      db
        .select({ userId: conversations.userId, conversationCount: count(conversations.id) })
        .from(conversations)
        .groupBy(conversations.userId)
        .orderBy(desc(count(conversations.id)))
        .limit(1),
    ]);

    // Training stats in a separate try/catch — tables may not yet be migrated
    let totalTrainingEvents = 0;
    let totalQuestionsAsked = 0;
    let totalCompletedTopics = 0;
    let totalFaqSelections = 0;
    let mostCompletedUser: { userId: string; progressPercent: string } | null = null;
    let latestTrainingActivity: string | null = null;
    let averageProgress = 0;

    try {
      const [teTotal, teQuestions, teCompletions, teFaqs, teLatest, upTop, upAvg] =
        await Promise.all([
          db.select({ n: count() }).from(trainingEvents),
          db
            .select({ n: count() })
            .from(trainingEvents)
            .where(eq(trainingEvents.eventType, "question_asked")),
          db
            .select({ n: count() })
            .from(trainingEvents)
            .where(eq(trainingEvents.eventType, "topic_completed")),
          db
            .select({ n: count() })
            .from(trainingEvents)
            .where(eq(trainingEvents.eventType, "quick_answer_selected")),
          db
            .select({ v: sql<string | null>`MAX(${trainingEvents.loggedAt})` })
            .from(trainingEvents),
          db
            .select({
              username: userProgress.username,
              progressPercent: userProgress.progressPercent,
            })
            .from(userProgress)
            .orderBy(desc(userProgress.progressPercent))
            .limit(1),
          db
            .select({ v: sql<string | null>`AVG(${userProgress.progressPercent})` })
            .from(userProgress),
        ]);

      totalTrainingEvents = Number(teTotal[0].n);
      totalQuestionsAsked = Number(teQuestions[0].n);
      totalCompletedTopics = Number(teCompletions[0].n);
      totalFaqSelections = Number(teFaqs[0].n);
      latestTrainingActivity = teLatest[0].v ?? null;
      mostCompletedUser = upTop[0]
        ? { userId: upTop[0].username, progressPercent: upTop[0].progressPercent ?? "0" }
        : null;
      averageProgress = upAvg[0].v ? Math.round(Number(upAvg[0].v)) : 0;
    } catch {
      // training_events / user_progress tables not yet migrated — return zeros
    }

    return NextResponse.json({
      totalUsers: Number(userCount[0].totalUsers),
      totalConversations: Number(convTotals[0].totalConversations),
      totalMessages: Number(msgTotals[0].totalMessages),
      conversationsToday: Number(convsToday[0].conversationsToday),
      messagesToday: Number(msgsToday[0].messagesToday),
      mostActiveUser: topUser[0]
        ? {
            userId: topUser[0].userId,
            conversationCount: Number(topUser[0].conversationCount),
          }
        : null,
      totalTrainingEvents,
      totalQuestionsAsked,
      totalCompletedTopics,
      totalFaqSelections,
      mostCompletedUser,
      latestTrainingActivity,
      averageProgress,
    });
  } catch (err) {
    console.error("[GET /api/admin/analytics]", err);
    return NextResponse.json({ error: "Failed to load analytics." }, { status: 500 });
  }
}
