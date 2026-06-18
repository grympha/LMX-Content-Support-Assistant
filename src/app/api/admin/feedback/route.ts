import { NextResponse } from "next/server";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { assistantFeedback } from "@/lib/schema";
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
      { error: "Database not configured." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const exportMode = searchParams.get("export") === "true";
  const pageNum = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = exportMode
    ? 9999
    : Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "50")));
  const offset = exportMode ? 0 : (pageNum - 1) * limit;
  const ratingParam = searchParams.get("rating");
  const ratingFilter = ratingParam && ratingParam !== "all" ? ratingParam : null;
  const usernameParam = searchParams.get("username");
  const usernameFilter = usernameParam && usernameParam !== "all" ? usernameParam : null;
  const searchTerm = searchParams.get("search")?.trim() ?? "";

  const conditions: SQL[] = [];
  if (ratingFilter) conditions.push(eq(assistantFeedback.rating, ratingFilter));
  if (usernameFilter) conditions.push(eq(assistantFeedback.username, usernameFilter));
  if (searchTerm) {
    const term = `%${searchTerm}%`;
    conditions.push(
      sql`(${assistantFeedback.question} ILIKE ${term} OR ${assistantFeedback.response} ILIKE ${term})`
    );
  }

  const whereClause: SQL | undefined =
    conditions.length > 0 ? and(...conditions) : undefined;

  try {
    const [totalResult, records, summaryResult] = await Promise.all([
      db.select({ n: count() }).from(assistantFeedback).where(whereClause),
      db
        .select({
          id: assistantFeedback.id,
          username: assistantFeedback.username,
          conversationId: assistantFeedback.conversationId,
          messageId: assistantFeedback.messageId,
          question: assistantFeedback.question,
          response: assistantFeedback.response,
          rating: assistantFeedback.rating,
          aiProvider: assistantFeedback.aiProvider,
          sources: assistantFeedback.sources,
          createdAt: assistantFeedback.createdAt,
        })
        .from(assistantFeedback)
        .where(whereClause)
        .orderBy(desc(assistantFeedback.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({
          total: count(),
          good: sql<number>`SUM(CASE WHEN ${assistantFeedback.rating} = 'good' THEN 1 ELSE 0 END)`,
          bad: sql<number>`SUM(CASE WHEN ${assistantFeedback.rating} = 'bad' THEN 1 ELSE 0 END)`,
        })
        .from(assistantFeedback),
    ]);

    const total = Number(totalResult[0].n);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const good = Number(summaryResult[0].good ?? 0);
    const bad = Number(summaryResult[0].bad ?? 0);
    const totalAll = Number(summaryResult[0].total ?? 0);
    const goodRate = totalAll > 0 ? Math.round((good / totalAll) * 100) : 0;

    return NextResponse.json({
      records,
      total,
      page: pageNum,
      totalPages,
      summary: { total: totalAll, good, bad, goodRate },
    });
  } catch (err) {
    console.error("[GET /api/admin/feedback]", err);
    return NextResponse.json({ error: "Failed to load feedback." }, { status: 500 });
  }
}
