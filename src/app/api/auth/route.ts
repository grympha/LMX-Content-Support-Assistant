import { NextResponse } from "next/server";
import { logProgressEvent } from "@/lib/progressLog";

const cookieName = "lmx-support-session";
const userCookieName = "lmx-support-user";

async function sessionToken(password: string) {
  const data = new TextEncoder().encode(`lmx-content-support:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function readCookie(cookieHeader: string, name: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function usernameFromCookie(cookieHeader: string) {
  const encodedUsername = readCookie(cookieHeader, userCookieName) ?? "";
  return encodedUsername ? decodeURIComponent(encodedUsername) : "";
}

export async function GET(request: Request) {
  const appPassword = process.env.APP_PASSWORD;
  const cookie = request.headers.get("cookie") ?? "";

  if (!appPassword) {
    return NextResponse.json({ authenticated: false, configured: false, username: "" });
  }

  const token = await sessionToken(appPassword);
  const authenticated = cookie.includes(`${cookieName}=${token}`);

  return NextResponse.json({
    authenticated,
    configured: true,
    username: authenticated ? usernameFromCookie(cookie) : "",
    hasAiProvider: Boolean(process.env.CLAUDE_API_KEY || process.env.OPENAI_API_KEY || process.env.MISTRAL_API_KEY)
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

  const body = (await request.json()) as { password?: string; username?: string };
  const username = body.username?.trim();

  if (!username) {
    return NextResponse.json({ error: "Username is required." }, { status: 400 });
  }

  if (body.password !== appPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, username });
  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  };

  response.cookies.set(cookieName, await sessionToken(appPassword), cookieOptions);
  response.cookies.set(userCookieName, encodeURIComponent(username), cookieOptions);

  await logProgressEvent({
    eventType: "login",
    username,
    details: "User signed in"
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(cookieName);
  response.cookies.delete(userCookieName);
  return response;
}
