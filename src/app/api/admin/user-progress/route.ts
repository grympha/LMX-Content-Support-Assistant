import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { userProgress } from "@/lib/schema";

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

  try {
    const rows = await db
      .select({
        username: userProgress.username,
        fullName: userProgress.fullName,
        progressPercent: userProgress.progressPercent,
        completedTopics: userProgress.completedTopics,
        lastActiveAt: userProgress.lastActiveAt,
      })
      .from(userProgress)
      .orderBy(desc(userProgress.progressPercent));

    return NextResponse.json(rows);
  } catch (err) {
    console.error("[GET /api/admin/user-progress]", err);
    return NextResponse.json(
      { error: "Failed to load user progress." },
      { status: 500 }
    );
  }
}
