import { NextResponse } from "next/server";
import { and, count, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { trainingEvents } from "@/lib/schema";

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
    const rows = await db
      .select({
        question: trainingEvents.question,
        count: count(),
        lastAsked: sql<string>`MAX(${trainingEvents.loggedAt})`,
      })
      .from(trainingEvents)
      .where(
        and(eq(trainingEvents.eventType, "question_asked"), isNotNull(trainingEvents.question))
      )
      .groupBy(trainingEvents.question)
      .orderBy(desc(count()))
      .limit(10);

    return NextResponse.json({
      topQuestions: rows.map((r) => ({
        question: r.question ?? "",
        count: Number(r.count),
        lastAsked: r.lastAsked ?? null,
      })),
    });
  } catch (err) {
    console.error("[GET /api/admin/search-analytics]", err);
    return NextResponse.json({ error: "Failed to load search analytics." }, { status: 500 });
  }
}
