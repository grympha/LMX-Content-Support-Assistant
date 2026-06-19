import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { learnedAnswers } from "@/lib/schema";
import { usernameFromRequest } from "@/lib/apiAuth";

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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_STATUSES = new Set(["candidate", "approved", "rejected"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    status?: string;
    response?: string;
  };

  const updates: Record<string, unknown> = { updatedAt: new Date() };

  if (body.status !== undefined) {
    if (!VALID_STATUSES.has(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    updates.status = body.status;
    if (body.status === "approved") {
      const approvedBy = await usernameFromRequest(request);
      updates.approvedBy = approvedBy ?? "admin";
      updates.approvedAt = new Date();
    }
  }

  if (body.response !== undefined) {
    const trimmed = body.response.trim().slice(0, 50000);
    if (!trimmed) {
      return NextResponse.json({ error: "Response cannot be empty." }, { status: 400 });
    }
    updates.response = trimmed;
  }

  try {
    const [row] = await db
      .update(learnedAnswers)
      .set(updates)
      .where(eq(learnedAnswers.id, id))
      .returning();

    if (!row) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, record: row });
  } catch (err) {
    console.error("[PATCH /api/admin/learned-answers/[id]]", err);
    return NextResponse.json({ error: "Failed to update record." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { id } = await params;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
  }

  try {
    const [deleted] = await db
      .delete(learnedAnswers)
      .where(eq(learnedAnswers.id, id))
      .returning({ id: learnedAnswers.id });

    if (!deleted) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/learned-answers/[id]]", err);
    return NextResponse.json({ error: "Failed to delete record." }, { status: 500 });
  }
}
