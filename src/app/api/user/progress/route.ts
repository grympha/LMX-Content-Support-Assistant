import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userProgress } from "@/lib/schema";
import { isAuthenticated, usernameFromRequest } from "@/lib/apiAuth";

export async function GET(request: Request) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const username = await usernameFromRequest(request);
  if (!username) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({
      username,
      completedTopics: [],
      progressPercent: 0,
      updatedAt: null,
    });
  }

  try {
    const rows = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.username, username.toLowerCase()))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({
        username,
        completedTopics: [],
        progressPercent: 0,
        updatedAt: null,
      });
    }

    const row = rows[0];
    return NextResponse.json({
      username: row.username,
      completedTopics: row.completedTopics ?? [],
      progressPercent: Number(row.progressPercent ?? 0),
      updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
    });
  } catch (err) {
    console.error("[GET /api/user/progress]", err);
    return NextResponse.json({
      username,
      completedTopics: [],
      progressPercent: 0,
      updatedAt: null,
    });
  }
}
