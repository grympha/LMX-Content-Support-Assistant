import { NextResponse } from "next/server";

const cookieName = "lmx-support-session";

async function sessionToken(password: string) {
  const data = new TextEncoder().encode(`lmx-content-support:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function GET(request: Request) {
  const appPassword = process.env.APP_PASSWORD;
  const cookie = request.headers.get("cookie") ?? "";

  if (!appPassword) {
    return NextResponse.json({ authenticated: false, configured: false });
  }

  const token = await sessionToken(appPassword);
  return NextResponse.json({
    authenticated: cookie.includes(`${cookieName}=${token}`),
    configured: true
  });
}

export async function POST(request: Request) {
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword) {
    return NextResponse.json(
      { error: "APP_PASSWORD is not configured." },
      { status: 500 }
    );
  }

  const body = (await request.json()) as { password?: string };

  if (body.password !== appPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, await sessionToken(appPassword), {
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
  response.cookies.delete(cookieName);
  return response;
}
