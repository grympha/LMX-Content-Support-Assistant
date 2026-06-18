import { NextResponse } from "next/server";
import { asc, count, sql } from "drizzle-orm";
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
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  try {
    const rows = await db
      .select({
        username: trainingEvents.username,
        trainingEventCount: count(),
        completedTopicCount: sql<number>`COUNT(CASE WHEN ${trainingEvents.eventType} = 'topic_completed' THEN 1 END)`,
        latestActivity: sql<string | null>`MAX(${trainingEvents.loggedAt})`,
      })
      .from(trainingEvents)
      .where(sql`${trainingEvents.username} != ''`)
      .groupBy(trainingEvents.username)
      .orderBy(asc(trainingEvents.username));

    const stats = rows.map((r) => ({
      username: r.username,
      trainingEventCount: Number(r.trainingEventCount),
      completedTopicCount: Number(r.completedTopicCount),
      latestActivity: r.latestActivity ?? null,
    }));

    return NextResponse.json(stats);
  } catch (err) {
    console.error("[GET /api/admin/training-users]", err);
    return NextResponse.json({ error: "Failed to load training users." }, { status: 500 });
  }
}
