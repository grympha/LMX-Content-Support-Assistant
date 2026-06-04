import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET as authGet, POST as authPost } from "../app/api/auth/route";

const makeRequest = (url: string, init?: RequestInit) => new Request(url, init);

describe("Auth route", () => {
  beforeEach(() => {
    process.env.APP_PASSWORD = "test-password";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.APP_PASSWORD;
  });

  it("returns configured false when APP_PASSWORD is missing", async () => {
    delete process.env.APP_PASSWORD;

    const response = await authGet(makeRequest("http://localhost/api/auth"));
    const body = await response.json();

    expect(body).toEqual({ authenticated: false, configured: false, username: "" });
  });

  it("returns 400 when username is missing", async () => {
    const response = await authPost(
      makeRequest("http://localhost/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: "test-password" })
      })
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Username is required." });
  });

  it("returns 401 when password is invalid", async () => {
    const response = await authPost(
      makeRequest("http://localhost/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "tester", password: "wrong-password" })
      })
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Invalid password." });
  });

  it("creates a session and sets cookies when credentials are valid", async () => {
    const response = await authPost(
      makeRequest("http://localhost/api/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: "tester", password: "test-password" })
      })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, username: "tester" });
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("lmx-support-session=");
    expect(setCookie).toContain("lmx-support-user=");
  });
});
