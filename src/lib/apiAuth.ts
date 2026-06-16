const SESSION_COOKIE = "lmx-support-session";
const USER_COOKIE = "lmx-support-user";

function readCookie(cookieHeader: string, name: string) {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

async function sessionToken(password: string) {
  const data = new TextEncoder().encode(`lmx-content-support:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function isAuthenticated(request: Request): Promise<boolean> {
  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) return false;
  const cookie = request.headers.get("cookie") ?? "";
  const token = await sessionToken(appPassword);
  return cookie.includes(`${SESSION_COOKIE}=${token}`);
}

export function usernameFromRequest(request: Request): string {
  const cookie = request.headers.get("cookie") ?? "";
  const encoded = readCookie(cookie, USER_COOKIE) ?? "";
  return encoded ? decodeURIComponent(encoded) : "";
}
