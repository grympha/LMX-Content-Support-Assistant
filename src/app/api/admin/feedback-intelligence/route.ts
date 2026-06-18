import { NextResponse } from "next/server";
import { and, count, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { assistantFeedback } from "@/lib/schema";

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
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  try {
    const [topBadQuestions, topGoodQuestions, badFeedbackSources] = await Promise.all([
      db
        .select({ question: assistantFeedback.question, badCount: count() })
        .from(assistantFeedback)
        .where(and(eq(assistantFeedback.rating, "bad"), isNotNull(assistantFeedback.question)))
        .groupBy(assistantFeedback.question)
        .orderBy(desc(count()))
        .limit(10),
      db
        .select({ question: assistantFeedback.question, goodCount: count() })
        .from(assistantFeedback)
        .where(and(eq(assistantFeedback.rating, "good"), isNotNull(assistantFeedback.question)))
        .groupBy(assistantFeedback.question)
        .orderBy(desc(count()))
        .limit(10),
      db
        .select({ sources: assistantFeedback.sources })
        .from(assistantFeedback)
        .where(and(eq(assistantFeedback.rating, "bad"), isNotNull(assistantFeedback.sources))),
    ]);

    // Aggregate sources in JS to find which topics get the most bad feedback
    const sourceCounts: Record<string, number> = {};
    for (const record of badFeedbackSources) {
      if (record.sources) {
        for (const source of record.sources) {
          if (source) sourceCounts[source] = (sourceCounts[source] ?? 0) + 1;
        }
      }
    }
    const topBadTopics = Object.entries(sourceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([source, cnt]) => ({ source, count: cnt }));

    return NextResponse.json({
      topBadQuestions: topBadQuestions.map((r) => ({
        question: r.question ?? "",
        count: Number(r.badCount),
      })),
      topGoodQuestions: topGoodQuestions.map((r) => ({
        question: r.question ?? "",
        count: Number(r.goodCount),
      })),
      topBadTopics,
    });
  } catch (err) {
    console.error("[GET /api/admin/feedback-intelligence]", err);
    return NextResponse.json({ error: "Failed to load feedback intelligence." }, { status: 500 });
  }
}
