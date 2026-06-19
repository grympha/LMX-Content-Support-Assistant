import { NextResponse } from "next/server";
import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { learnedAnswers } from "@/lib/schema";

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

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "all";
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)));
  const offset = (page - 1) * limit;

  try {
    const whereClause =
      status !== "all"
        ? eq(learnedAnswers.status, status)
        : undefined;

    const [rows, totalRows] = await Promise.all([
      db
        .select()
        .from(learnedAnswers)
        .where(whereClause)
        .orderBy(desc(learnedAnswers.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(learnedAnswers)
        .where(whereClause),
    ]);

    const [candidates, approved, rejected] = await Promise.all([
      db.select({ total: count() }).from(learnedAnswers).where(eq(learnedAnswers.status, "candidate")),
      db.select({ total: count() }).from(learnedAnswers).where(eq(learnedAnswers.status, "approved")),
      db.select({ total: count() }).from(learnedAnswers).where(eq(learnedAnswers.status, "rejected")),
    ]);

    return NextResponse.json({
      records: rows,
      total: totalRows[0]?.total ?? 0,
      page,
      limit,
      totalPages: Math.ceil((totalRows[0]?.total ?? 0) / limit),
      summary: {
        candidates: candidates[0]?.total ?? 0,
        approved: approved[0]?.total ?? 0,
        rejected: rejected[0]?.total ?? 0,
      },
    });
  } catch (err) {
    console.error("[GET /api/admin/learned-answers]", err);
    return NextResponse.json({ error: "Failed to load learned answers." }, { status: 500 });
  }
}
