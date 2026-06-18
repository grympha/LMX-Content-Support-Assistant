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

async function hmacSign(password: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Build the signed user cookie value: encodeURIComponent(username).HMAC64HEX
// Old unsigned cookies (no .HMAC suffix) are automatically rejected by verifyUserCookieValue.
export async function makeUserCookieValue(password: string, username: string): Promise<string> {
  const mac = await hmacSign(password, `lmx-user:${username}`);
  return `${encodeURIComponent(username)}.${mac}`;
}

// Returns the verified username or "" if the cookie is absent or tampered.
async function verifyUserCookieValue(password: string, raw: string): Promise<string> {
  if (!raw) return "";
  const lastDot = raw.lastIndexOf(".");
  if (lastDot < 0) return "";
  const tail = raw.slice(lastDot + 1);
  // HMAC-SHA-256 is always exactly 64 lowercase hex characters
  if (tail.length !== 64 || !/^[0-9a-f]{64}$/.test(tail)) return "";
  const username = decodeURIComponent(raw.slice(0, lastDot));
  if (!username) return "";
  const expected = await hmacSign(password, `lmx-user:${username}`);
  return tail === expected ? username : "";
}

export async function isAuthenticated(request: Request): Promise<boolean> {
  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) return false;
  const cookie = request.headers.get("cookie") ?? "";
  const token = await sessionToken(appPassword);
  return cookie.includes(`${SESSION_COOKIE}=${token}`);
}

// Returns the HMAC-verified username, or "" if the session is absent or the user cookie is
// missing/tampered. Callers should treat "" as unauthenticated identity.
export async function usernameFromRequest(request: Request): Promise<string> {
  const appPassword = process.env.APP_PASSWORD;
  if (!appPassword) return "";
  const cookie = request.headers.get("cookie") ?? "";
  const raw = readCookie(cookie, USER_COOKIE) ?? "";
  return verifyUserCookieValue(appPassword, raw);
}

// Shared cookie options for both the session and user cookies.
export function sessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure,
    path: "/",
    maxAge: 60 * 60 * 12,
  };
}

export { SESSION_COOKIE, USER_COOKIE, sessionToken };
