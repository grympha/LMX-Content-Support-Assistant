import { NextResponse } from "next/server";

const adminCookieName = "lmx-admin-session";

export type TrainingRecord = {
  timestamp: string;
  timezone: string;
  username: string;
  eventType: string;
  topic: string;
  question: string;
  progressPercent: string | number;
  completedTopics: string;
  source: string;
  details: string;
};

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

async function isAdmin(request: Request) {
  const password = adminPassword();

  if (!password) {
    return false;
  }

  const token = await sessionToken(password);
  const cookie = request.headers.get("cookie") ?? "";
  return cookie.includes(`${adminCookieName}=${token}`);
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({
      records: [],
      warning: "GOOGLE_SHEETS_WEBHOOK_URL is not configured."
    });
  }

  try {
    const url = new URL(webhookUrl);
    url.searchParams.set("mode", "records");

    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Google Sheets request failed with ${response.status}`);
    }

    const data = (await response.json()) as { records?: TrainingRecord[] };

    return NextResponse.json({ records: data.records ?? [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        records: [],
        error: "Unable to load Google Sheets records. Confirm the Apps Script doGet function is deployed."
      },
      { status: 502 }
    );
  }
}
