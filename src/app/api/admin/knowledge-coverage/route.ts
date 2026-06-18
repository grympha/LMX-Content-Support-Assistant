import { NextResponse } from "next/server";
import { and, count, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { trainingEvents } from "@/lib/schema";
import { issueCategories } from "@/lib/lmxKnowledge";

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

  const trackableTopics = issueCategories.filter((c) => c !== "Other");

  try {
    const [accessedRows, topicFreqRows] = await Promise.all([
      // Distinct topics that have been selected
      db
        .select({ topic: trainingEvents.topic })
        .from(trainingEvents)
        .where(
          and(eq(trainingEvents.eventType, "topic_selected"), isNotNull(trainingEvents.topic))
        )
        .groupBy(trainingEvents.topic),

      // Topics with their access frequency (for most/least)
      db
        .select({ topic: trainingEvents.topic, selections: count() })
        .from(trainingEvents)
        .where(
          and(eq(trainingEvents.eventType, "topic_selected"), isNotNull(trainingEvents.topic))
        )
        .groupBy(trainingEvents.topic)
        .orderBy(desc(count())),
    ]);

    const accessedSet = new Set(
      accessedRows.map((r) => r.topic).filter((t): t is string => Boolean(t))
    );

    const topicsAccessed = trackableTopics.filter((t) => accessedSet.has(t));
    const topicsNeverAccessed = trackableTopics.filter((t) => !accessedSet.has(t));
    const coveragePercent =
      trackableTopics.length > 0
        ? Math.round((topicsAccessed.length / trackableTopics.length) * 100)
        : 0;

    const freqMap = new Map(
      topicFreqRows.map((r) => [r.topic, Number(r.selections)])
    );

    // Most accessed: highest selections among trackable topics
    const mostAccessed = trackableTopics
      .map((t) => ({ topic: t, count: freqMap.get(t) ?? 0 }))
      .sort((a, b) => b.count - a.count)[0];

    // Least accessed: lowest selections among topics that have been accessed at all
    const leastAccessed = topicsAccessed
      .map((t) => ({ topic: t, count: freqMap.get(t) ?? 0 }))
      .sort((a, b) => a.count - b.count)[0];

    return NextResponse.json({
      totalTopics: trackableTopics.length,
      topicsAccessed: topicsAccessed.length,
      topicsNeverAccessed: topicsNeverAccessed.length,
      coveragePercent,
      mostAccessedTopic: mostAccessed?.count > 0 ? mostAccessed.topic : null,
      leastAccessedTopic: leastAccessed?.topic ?? null,
      neverAccessedTopics: topicsNeverAccessed,
    });
  } catch (err) {
    console.error("[GET /api/admin/knowledge-coverage]", err);
    return NextResponse.json({ error: "Failed to load knowledge coverage." }, { status: 500 });
  }
}
