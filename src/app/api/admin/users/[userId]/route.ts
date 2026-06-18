import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { conversations } from "@/lib/schema";

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
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json(
      { error: "Conversation database is not configured." },
      { status: 503 }
    );
  }

  const { userId } = await params;
  const cleanUserId = (userId ?? "").trim();

  if (!cleanUserId || cleanUserId.length > 255) {
    return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
  }

  try {
    const deleted = await db
      .delete(conversations)
      .where(eq(conversations.userId, cleanUserId))
      .returning({ id: conversations.id });

    return NextResponse.json({
      ok: true,
      deletedConversations: deleted.length,
      userId: cleanUserId,
    });
  } catch (err) {
    console.error("[DELETE /api/admin/users/[userId]]", err);
    return NextResponse.json({ error: "Failed to delete user conversations." }, { status: 500 });
  }
}
