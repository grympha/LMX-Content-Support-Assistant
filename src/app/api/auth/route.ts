import { NextResponse } from "next/server";
import { logProgressEvent } from "@/lib/progressLog";
import {
  isAuthenticated,
  makeUserCookieValue,
  usernameFromRequest,
  sessionToken,
  sessionCookieOptions,
  SESSION_COOKIE,
  USER_COOKIE,
} from "@/lib/apiAuth";

// Only @movingwalls.com addresses are accepted.
const MW_EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@movingwalls\.com$/i;

function validateMWEmail(email: string): string | null {
  if (!email) return "Email is required.";
  if (!MW_EMAIL_RE.test(email)) {
    if (email.includes("@") && !email.toLowerCase().endsWith("@movingwalls.com")) {
      return "Only @movingwalls.com email addresses are allowed.";
    }
    return "Enter a valid @movingwalls.com email address.";
  }
  return null;
}

// username = local part of the email, lowercase (e.g. "hezri", "john.smith")
function deriveUsername(email: string): string {
  return email.toLowerCase().split("@")[0];
}

// Display name capitalises each dot-separated segment (e.g. "john.smith" → "John Smith")
function deriveDisplayName(username: string): string {
  return username
    .split(".")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ")
    .trim();
}

export async function GET(request: Request) {
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword) {
    return NextResponse.json({ authenticated: false, configured: false, username: "", displayName: "" });
  }

  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ authenticated: false, configured: true, username: "", displayName: "" });
  }

  // Verify user identity via HMAC-signed cookie.
  // Returns "" for old unsigned cookies — forces re-login.
  const username = await usernameFromRequest(request);
  if (!username) {
    return NextResponse.json({ authenticated: false, configured: true, username: "", displayName: "" });
  }

  return NextResponse.json({
    authenticated: true,
    configured: true,
    username,
    displayName: deriveDisplayName(username),
    hasAiProvider: Boolean(
      process.env.CLAUDE_API_KEY || process.env.OPENAI_API_KEY || process.env.MISTRAL_API_KEY
    ),
  });
}

export async function POST(request: Request) {
  const appPassword = process.env.APP_PASSWORD;

  if (!appPassword) {
    return NextResponse.json({ error: "APP_PASSWORD is not configured." }, { status: 500 });
  }

  const body = (await request.json()) as { password?: string; email?: string };

  const emailError = validateMWEmail((body.email ?? "").trim());
  if (emailError) {
    return NextResponse.json({ error: emailError }, { status: 400 });
  }

  if (body.password !== appPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const username = deriveUsername(email);
  const displayName = deriveDisplayName(username);

  const opts = sessionCookieOptions(process.env.NODE_ENV === "production");
  const response = NextResponse.json({ ok: true, username, displayName });
  response.cookies.set(SESSION_COOKIE, await sessionToken(appPassword), opts);
  response.cookies.set(USER_COOKIE, await makeUserCookieValue(appPassword, username), opts);

  await logProgressEvent({
    eventType: "login",
    username,
    fullName: displayName,
    details: "User signed in",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  response.cookies.delete(USER_COOKIE);
  return response;
}
