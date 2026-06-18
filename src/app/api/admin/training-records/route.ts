import { NextResponse } from "next/server";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
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
    return NextResponse.json(
      { error: "Database is not configured." },
      { status: 503 }
    );
  }

  const url = new URL(request.url);
  const exportMode = url.searchParams.get("export") === "true";
  const rawPage = parseInt(url.searchParams.get("page") ?? "1", 10);
  const rawLimit = parseInt(url.searchParams.get("limit") ?? "50", 10);
  const pageNum = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = exportMode
    ? 9999
    : Number.isFinite(rawLimit)
    ? Math.min(100, Math.max(1, rawLimit))
    : 50;
  const offset = exportMode ? 0 : (pageNum - 1) * limit;

  const usernameParam = (url.searchParams.get("username") ?? "").trim();
  const eventParam = (url.searchParams.get("event") ?? "").trim();
  const searchParam = (url.searchParams.get("search") ?? "").trim();

  const conditions: SQL<unknown>[] = [];
  if (usernameParam) conditions.push(eq(trainingEvents.username, usernameParam));
  if (eventParam) conditions.push(eq(trainingEvents.eventType, eventParam));
  if (searchParam) {
    const escaped = searchParam.replace(/[%_\\]/g, "\\$&");
    const term = `%${escaped}%`;
    const searchExpr = or(
      ilike(trainingEvents.username, term),
      ilike(trainingEvents.topic, term),
      ilike(trainingEvents.question, term)
    );
    if (searchExpr) conditions.push(searchExpr);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  try {
    const [{ total }] = await db
      .select({ total: count() })
      .from(trainingEvents)
      .where(where);

    const totalNum = Number(total);
    const totalPages = Math.max(1, Math.ceil(totalNum / limit));

    const records = await db
      .select({
        id: trainingEvents.id,
        username: trainingEvents.username,
        fullName: trainingEvents.fullName,
        eventType: trainingEvents.eventType,
        topic: trainingEvents.topic,
        question: trainingEvents.question,
        progressPercent: trainingEvents.progressPercent,
        loggedAt: trainingEvents.loggedAt,
      })
      .from(trainingEvents)
      .where(where)
      .orderBy(desc(trainingEvents.loggedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ records, total: totalNum, page: pageNum, totalPages });
  } catch (err) {
    console.error("[GET /api/admin/training-records]", err);
    return NextResponse.json(
      { error: "Failed to load training records." },
      { status: 500 }
    );
  }
}
