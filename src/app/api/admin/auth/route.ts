import { NextResponse } from "next/server";

const adminCookieName = "lmx-admin-session";

async function sessionToken(password: string) {
  const data = new TextEncoder().encode(`lmx-admin:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || process.env.APP_PASSWORD || "";
}

export async function GET(request: Request) {
  const password = adminPassword();
  const cookie = request.headers.get("cookie") ?? "";

  if (!password) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  const token = await sessionToken(password);
  return NextResponse.json({
    authenticated: cookie.includes(`${adminCookieName}=${token}`),
    configured: true
  });
}

export async function POST(request: Request) {
  const password = adminPassword();

  if (!password) {
    return NextResponse.json({ error: "ADMIN_PASSWORD or APP_PASSWORD is not configured." }, { status: 500 });
  }

  const body = (await request.json()) as { password?: string };

  if (body.password !== password) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminCookieName, await sessionToken(password), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(adminCookieName);
  return response;
}
