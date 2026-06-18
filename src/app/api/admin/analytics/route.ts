import { NextResponse } from "next/server";
import { and, count, desc, eq, gte, lt, sql } from "drizzle-orm";
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

type TrendData = {
  current: number;
  previous: number;
  pct: number;
  direction: "up" | "down" | "flat";
};

function calcTrend(current: number, previous: number): TrendData {
  if (previous === 0) {
    return { current, previous, pct: 0, direction: current > 0 ? "up" : "flat" };
  }
  const raw = ((current - previous) / previous) * 100;
  const pct = Math.abs(Math.round(raw));
  const direction: "up" | "down" | "flat" = raw > 0.5 ? "up" : raw < -0.5 ? "down" : "flat";
  return { current, previous, pct, direction };
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

  const teWhere: SQL | undefined = filterUsername
    ? eq(trainingEvents.username, filterUsername)
    : undefined;
  const upWhere: SQL | undefined = filterUsername
    ? eq(userProgress.username, filterUsername)
    : undefined;

  const nowMs = Date.now();
  const nowMalaysia = new Date(nowMs + 8 * 60 * 60 * 1000);
  const todayStart = new Date(
    Date.UTC(
      nowMalaysia.getUTCFullYear(),
      nowMalaysia.getUTCMonth(),
      nowMalaysia.getUTCDate()
    ) -
      8 * 60 * 60 * 1000
  );
  const sevenDaysAgo = new Date(nowMs - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(nowMs - 14 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(nowMs - 30 * 24 * 60 * 60 * 1000);

  try {
    const [convTotals, msgTotals, convsToday, msgsToday, topUser, newestConvRes, oldestConvRes] =
      await Promise.all([
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
        db
          .select({ createdAt: conversations.createdAt })
          .from(conversations)
          .orderBy(desc(conversations.createdAt))
          .limit(1),
        db
          .select({ createdAt: conversations.createdAt })
          .from(conversations)
          .orderBy(conversations.createdAt)
          .limit(1),
      ]);

    let totalUsers = 0;
    let totalTrainingEvents = 0;
    let totalQuestionsAsked = 0;
    let totalCompletedTopics = 0;
    let totalFaqSelections = 0;
    let mostCompletedUser: { userId: string; progressPercent: string } | null = null;
    let latestTrainingActivity: string | null = null;
    let averageProgress = 0;
    let questionsAskedTrend: TrendData | null = null;
    let completedTopicsTrend: TrendData | null = null;
    let faqSelectionsTrend: TrendData | null = null;
    let dau = 0;
    let wau = 0;
    let mau = 0;

    try {
      // Build trend where conditions, handling optional username filter
      const mkWhere = (base: SQL | undefined, extra: SQL) =>
        base ? and(base, extra) : extra;

      const [
        teTotal,
        teQuestions,
        teCompletions,
        teFaqs,
        teLatest,
        teDistinctUsers,
        upTop,
        upProgressSum,
        // Trend: questions current vs previous 7d
        qCurrent,
        qPrev,
        // Trend: completions current vs previous 7d
        cCurrent,
        cPrev,
        // Trend: faqs current vs previous 7d
        fCurrent,
        fPrev,
        // DAU / WAU / MAU
        dauRes,
        wauRes,
        mauRes,
      ] = await Promise.all([
        db.select({ n: count() }).from(trainingEvents).where(teWhere),
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(mkWhere(teWhere, eq(trainingEvents.eventType, "question_asked"))),
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(mkWhere(teWhere, eq(trainingEvents.eventType, "topic_completed"))),
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(mkWhere(teWhere, eq(trainingEvents.eventType, "quick_answer_selected"))),
        db
          .select({ v: sql<string | null>`MAX(${trainingEvents.loggedAt})` })
          .from(trainingEvents)
          .where(teWhere),
        db
          .select({ n: sql<number>`COUNT(DISTINCT NULLIF(${trainingEvents.username}, ''))` })
          .from(trainingEvents)
          .where(teWhere),
        db
          .select({ username: userProgress.username, progressPercent: userProgress.progressPercent })
          .from(userProgress)
          .where(upWhere)
          .orderBy(desc(userProgress.progressPercent))
          .limit(1),
        db
          .select({ total: sql<string | null>`SUM(${userProgress.progressPercent})` })
          .from(userProgress)
          .where(upWhere),
        // Questions: current 7d
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(
            mkWhere(
              teWhere,
              and(eq(trainingEvents.eventType, "question_asked"), gte(trainingEvents.loggedAt, sevenDaysAgo))!
            )
          ),
        // Questions: previous 7d
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(
            mkWhere(
              teWhere,
              and(
                eq(trainingEvents.eventType, "question_asked"),
                gte(trainingEvents.loggedAt, fourteenDaysAgo),
                lt(trainingEvents.loggedAt, sevenDaysAgo)
              )!
            )
          ),
        // Completions: current 7d
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(
            mkWhere(
              teWhere,
              and(eq(trainingEvents.eventType, "topic_completed"), gte(trainingEvents.loggedAt, sevenDaysAgo))!
            )
          ),
        // Completions: previous 7d
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(
            mkWhere(
              teWhere,
              and(
                eq(trainingEvents.eventType, "topic_completed"),
                gte(trainingEvents.loggedAt, fourteenDaysAgo),
                lt(trainingEvents.loggedAt, sevenDaysAgo)
              )!
            )
          ),
        // FAQs: current 7d
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(
            mkWhere(
              teWhere,
              and(eq(trainingEvents.eventType, "quick_answer_selected"), gte(trainingEvents.loggedAt, sevenDaysAgo))!
            )
          ),
        // FAQs: previous 7d
        db
          .select({ n: count() })
          .from(trainingEvents)
          .where(
            mkWhere(
              teWhere,
              and(
                eq(trainingEvents.eventType, "quick_answer_selected"),
                gte(trainingEvents.loggedAt, fourteenDaysAgo),
                lt(trainingEvents.loggedAt, sevenDaysAgo)
              )!
            )
          ),
        // DAU: unique users today
        db
          .select({ n: sql<number>`COUNT(DISTINCT NULLIF(${trainingEvents.username}, ''))` })
          .from(trainingEvents)
          .where(gte(trainingEvents.loggedAt, todayStart)),
        // WAU: unique users last 7 days
        db
          .select({ n: sql<number>`COUNT(DISTINCT NULLIF(${trainingEvents.username}, ''))` })
          .from(trainingEvents)
          .where(gte(trainingEvents.loggedAt, sevenDaysAgo)),
        // MAU: unique users last 30 days
        db
          .select({ n: sql<number>`COUNT(DISTINCT NULLIF(${trainingEvents.username}, ''))` })
          .from(trainingEvents)
          .where(gte(trainingEvents.loggedAt, thirtyDaysAgo)),
      ]);

      totalTrainingEvents = Number(teTotal[0].n);
      totalQuestionsAsked = Number(teQuestions[0].n);
      totalCompletedTopics = Number(teCompletions[0].n);
      totalFaqSelections = Number(teFaqs[0].n);
      latestTrainingActivity = teLatest[0].v ?? null;
      totalUsers = Number(teDistinctUsers[0].n);

      mostCompletedUser = upTop[0]
        ? { userId: upTop[0].username, progressPercent: upTop[0].progressPercent ?? "0" }
        : null;

      const progressSum = upProgressSum[0].total ? Number(upProgressSum[0].total) : 0;
      averageProgress = totalUsers > 0 ? Math.round(progressSum / totalUsers) : 0;

      questionsAskedTrend = calcTrend(Number(qCurrent[0].n), Number(qPrev[0].n));
      completedTopicsTrend = calcTrend(Number(cCurrent[0].n), Number(cPrev[0].n));
      faqSelectionsTrend = calcTrend(Number(fCurrent[0].n), Number(fPrev[0].n));

      dau = Number(dauRes[0].n);
      wau = Number(wauRes[0].n);
      mau = Number(mauRes[0].n);
    } catch {
      // training_events / user_progress not yet migrated — training fields default to 0
    }

    const totalConversations = Number(convTotals[0].totalConversations);
    const totalMessages = Number(msgTotals[0].totalMessages);
    const avgConversationsPerUser =
      totalUsers > 0 ? Math.round((totalConversations / totalUsers) * 10) / 10 : 0;
    const avgMessagesPerConversation =
      totalConversations > 0 ? Math.round((totalMessages / totalConversations) * 10) / 10 : 0;

    const tsToStr = (v: unknown): string | null => {
      if (!v) return null;
      if (v instanceof Date) return v.toISOString();
      return String(v);
    };

    return NextResponse.json({
      totalUsers,
      totalConversations,
      totalMessages,
      conversationsToday: Number(convsToday[0].conversationsToday),
      messagesToday: Number(msgsToday[0].messagesToday),
      mostActiveUser: topUser[0]
        ? { userId: topUser[0].userId, conversationCount: Number(topUser[0].conversationCount) }
        : null,
      avgConversationsPerUser,
      avgMessagesPerConversation,
      newestConversation: tsToStr(newestConvRes[0]?.createdAt),
      oldestConversation: tsToStr(oldestConvRes[0]?.createdAt),
      totalTrainingEvents,
      totalQuestionsAsked,
      totalCompletedTopics,
      totalFaqSelections,
      mostCompletedUser,
      latestTrainingActivity,
      averageProgress,
      // New: trend data
      questionsAskedTrend,
      completedTopicsTrend,
      faqSelectionsTrend,
      // New: DAU/WAU/MAU
      dau,
      wau,
      mau,
    });
  } catch (err) {
    console.error("[GET /api/admin/analytics]", err);
    return NextResponse.json({ error: "Failed to load analytics." }, { status: 500 });
  }
}
