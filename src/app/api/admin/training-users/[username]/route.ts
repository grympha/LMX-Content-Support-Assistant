import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { trainingEvents, userProgress } from "@/lib/schema";

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  }

  const { username } = await params;
  const cleanUsername = (username ?? "").trim();

  if (!cleanUsername || cleanUsername.length > 255) {
    return NextResponse.json({ error: "Invalid username." }, { status: 400 });
  }

  try {
    const [deletedEvents, deletedProgress] = await Promise.all([
      db
        .delete(trainingEvents)
        .where(eq(trainingEvents.username, cleanUsername))
        .returning({ id: trainingEvents.id }),
      db
        .delete(userProgress)
        .where(eq(userProgress.username, cleanUsername))
        .returning({ username: userProgress.username }),
    ]);

    return NextResponse.json({
      ok: true,
      username: cleanUsername,
      deletedEvents: deletedEvents.length,
      deletedProgress: deletedProgress.length,
    });
  } catch (err) {
    console.error("[DELETE /api/admin/training-users/[username]]", err);
    return NextResponse.json({ error: "Failed to delete training records." }, { status: 500 });
  }
}
