import { NextResponse } from "next/server";
import { count, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations, messages, trainingEvents, userProgress } from "@/lib/schema";
import type { SQL } from "drizzle-orm";

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

  const { searchParams } = new URL(request.url);
  const usernameParam = searchParams.get("username");
  const filterUsername = usernameParam && usernameParam !== "all" ? usernameParam : null;

  // Per-table WHERE conditions, undefined = no filter (Drizzle no-op)
  const teWhere: SQL | undefined = filterUsername
    ? eq(trainingEvents.username, filterUsername)
    : undefined;
  const upWhere: SQL | undefined = filterUsername
    ? eq(userProgress.username, filterUsername)
    : undefined;

  // "Today" boundary in Malaysia timezone (UTC+8).
  // Shift now to Malaysian wall-clock date, truncate to midnight, shift back to UTC.
  const nowMalaysia = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const todayStart = new Date(
    Date.UTC(
      nowMalaysia.getUTCFullYear(),
      nowMalaysia.getUTCMonth(),
      nowMalaysia.getUTCDate()
    ) -
      8 * 60 * 60 * 1000
  );

  try {
    // Conversation analytics — source: conversations + messages tables
    const [convTotals, msgTotals, convsToday, msgsToday, topUser] = await Promise.all([
      db.select({ totalConversations: count(conversations.id) }).from(conversations),
      db.select({ totalMessages: count(messages.id) }).from(messages),
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

    // Training stats — source: training_events + user_progress tables.
    // In a separate try/catch so the route still works if training tables are not migrated yet.
    let totalUsers = 0;
    let totalTrainingEvents = 0;
    let totalQuestionsAsked = 0;
    let totalCompletedTopics = 0;
    let totalFaqSelections = 0;
    let mostCompletedUser: { userId: string; progressPercent: string } | null = null;
    let latestTrainingActivity: string | null = null;
    let averageProgress = 0;

    try {
      const [
        teTotal,
        teQuestions,
        teCompletions,
        teFaqs,
        teLatest,
        teDistinctUsers,
        upTop,
        upProgressSum,
      ] = await Promise.all([
        // Total events (filtered by username when present)
        db.select({ n: count() }).from(trainingEvents).where(teWhere),
        // question_asked count
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(teWhere ? sql`${teWhere} AND ${eq(trainingEvents.eventType, "question_asked")}` : eq(trainingEvents.eventType, "question_asked")),
        // topic_completed count
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(teWhere ? sql`${teWhere} AND ${eq(trainingEvents.eventType, "topic_completed")}` : eq(trainingEvents.eventType, "topic_completed")),
        // quick_answer_selected count
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(teWhere ? sql`${teWhere} AND ${eq(trainingEvents.eventType, "quick_answer_selected")}` : eq(trainingEvents.eventType, "quick_answer_selected")),
        // Latest activity timestamp
        db
          .select({ v: sql<string | null>`MAX(${trainingEvents.loggedAt})` })
          .from(trainingEvents)
          .where(teWhere),
        // Distinct user count — NULLIF excludes blank usernames; filtered to one when username param set
        db
          .select({
            n: sql<number>`COUNT(DISTINCT NULLIF(${trainingEvents.username}, ''))`,
          })
          .from(trainingEvents)
          .where(teWhere),
        // Top learner by progress (filtered to single user when username param set)
        db
          .select({
            username: userProgress.username,
            progressPercent: userProgress.progressPercent,
          })
          .from(userProgress)
          .where(upWhere)
          .orderBy(desc(userProgress.progressPercent))
          .limit(1),
        // Sum of recorded progress (filtered to single user when username param set)
        db
          .select({ total: sql<string | null>`SUM(${userProgress.progressPercent})` })
          .from(userProgress)
          .where(upWhere),
      ]);

      totalTrainingEvents = Number(teTotal[0].n);
      totalQuestionsAsked = Number(teQuestions[0].n);
      totalCompletedTopics = Number(teCompletions[0].n);
      totalFaqSelections = Number(teFaqs[0].n);
      latestTrainingActivity = teLatest[0].v ?? null;

      // Total Users = distinct usernames in training_events (excludes blank usernames)
      totalUsers = Number(teDistinctUsers[0].n);

      mostCompletedUser = upTop[0]
        ? { userId: upTop[0].username, progressPercent: upTop[0].progressPercent ?? "0" }
        : null;

      // Average progress = total recorded progress / all distinct training users.
      // Users without a user_progress row contribute 0%, giving an accurate cohort average.
      const progressSum = upProgressSum[0].total ? Number(upProgressSum[0].total) : 0;
      averageProgress = totalUsers > 0 ? Math.round(progressSum / totalUsers) : 0;
    } catch {
      // training_events / user_progress not yet migrated — all training fields default to 0
    }

    return NextResponse.json({
      // Training-sourced total (all distinct learners, not just conversation users)
      totalUsers,
      // Conversation analytics
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
      // Training analytics
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
