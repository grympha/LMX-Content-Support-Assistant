import { NextResponse } from "next/server";
import { logProgressEvent, type ProgressEvent } from "@/lib/progressLog";
import { isAuthenticated, usernameFromRequest } from "@/lib/apiAuth";

export async function POST(request: Request) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  // Use HMAC-verified session username as canonical identity — ignore body.username
  const sessionUsername = await usernameFromRequest(request);

  const body = (await request.json()) as ProgressEvent;

  await logProgressEvent({
    ...body,
    username: sessionUsername || body.username,
  });

  return NextResponse.json({ ok: true });
}
