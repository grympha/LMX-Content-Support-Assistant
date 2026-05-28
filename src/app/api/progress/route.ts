import { NextResponse } from "next/server";
import { logProgressEvent, type ProgressEvent } from "@/lib/progressLog";

const sessionCookieName = "lmx-support-session";
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

async function getSession(request: Request) {
  const appPassword = process.env.APP_PASSWORD;
  const cookie = request.headers.get("cookie") ?? "";

  if (!appPassword) {
    return { authenticated: false, username: "" };
  }

  const token = await sessionToken(appPassword);
  const authenticated = cookie.includes(`${sessionCookieName}=${token}`);
  const encodedUsername = readCookie(cookie, userCookieName) ?? "";
  const username = encodedUsername ? decodeURIComponent(encodedUsername) : "";

  return { authenticated, username };
}

export async function POST(request: Request) {
  const session = await getSession(request);

  if (!session.authenticated) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as ProgressEvent;

  await logProgressEvent({
    ...body,
    username: body.username || session.username
  });

  return NextResponse.json({ ok: true });
}
