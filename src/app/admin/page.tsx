"use client";

import { FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

type UserStat = {
  userId: string;
  conversationCount: number;
  messageCount: number;
  latestActivity: string | null;
};

type AnalyticsData = {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  conversationsToday: number;
  messagesToday: number;
  mostActiveUser: { userId: string; conversationCount: number } | null;
  totalTrainingEvents: number;
  totalQuestionsAsked: number;
  totalCompletedTopics: number;
  totalFaqSelections: number;
  mostCompletedUser: { userId: string; progressPercent: string } | null;
  latestTrainingActivity: string | null;
  averageProgress: number;
};

type NeonTrainingRecord = {
  id: string;
  username: string;
  fullName: string | null;
  eventType: string;
  topic: string | null;
  question: string | null;
  progressPercent: string | null;
  loggedAt: string;
};

type NeonUserProgress = {
  username: string;
  fullName: string | null;
  progressPercent: string | null;
  completedTopics: string[] | null;
  lastActiveAt: string;
};

const EVENT_TYPES = [
  "login",
  "topic_selected",
  "topic_completed",
  "question_asked",
  "quick_answer_selected",
] as const;

function progressNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatProgress(value: string | number | null | undefined) {
  const n = progressNumber(value);
  return n > 0 ? `${Math.round(n)}%` : "-";
}

function timestampValue(timestamp: string) {
  const parsed = Date.parse(timestamp);
  if (Number.isFinite(parsed)) return parsed;

  const match = timestamp.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/
  );
  if (!match) return 0;
  const [, day, month, year, hour, minute, second = "0"] = match;
  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  ).getTime();
}

function formatMalaysiaTimestamp(timestamp: string | undefined | null) {
  if (!timestamp) return "-";
  const ms = timestampValue(timestamp);
  if (!ms) return timestamp;
  try {
    return new Date(ms)
      .toLocaleString("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/,?\s*/g, " ")
      .trim();
  } catch {
    return timestamp;
  }
}

export default function AdminDashboard() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Training records (Neon)
  const [neonRecords, setNeonRecords] = useState<NeonTrainingRecord[]>([]);
  const [neonLoading, setNeonLoading] = useState(false);
  const [neonError, setNeonError] = useState("");
  const [neonTotal, setNeonTotal] = useState(0);
  const [neonTotalPages, setNeonTotalPages] = useState(1);
  const [neonAvailable, setNeonAvailable] = useState(true);

  // User progress (Neon)
  const [userProgressData, setUserProgressData] = useState<NeonUserProgress[]>([]);
  const [userProgressLoading, setUserProgressLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);

  // Training record username options (distinct from training_events)
  const [trainingUsernames, setTrainingUsernames] = useState<string[]>([]);

  // User management
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [userConvFilter, setUserConvFilter] = useState("all");
  const [userStatsLoading, setUserStatsLoading] = useState(true);
  const [userStatsError, setUserStatsError] = useState("");
  const [userStatsAvailable, setUserStatsAvailable] = useState(true);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [deletedUserInfo, setDeletedUserInfo] = useState<{
    userId: string;
    conversations: number;
    messages: number;
  } | null>(null);
  const [exportingUserId, setExportingUserId] = useState<string | null>(null);

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsAvailable, setAnalyticsAvailable] = useState(true);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((r) => r.json())
      .then((d: { authenticated: boolean }) => setAuthenticated(d.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (authenticated) {
      void loadAnalytics();
      void loadUserStats();
      void loadTrainingUsernames();
      void loadTrainingRecords({
        targetPage: 1,
        limit: recordsPerPage,
        username: "all",
        event: "all",
        search: "",
      });
      void loadUserProgress();
    }
  }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setAuthError(data.error ?? "Unable to sign in.");
      return;
    }
    setPassword("");
    setAuthenticated(true);
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setNeonRecords([]);
  }

  function handleRefreshAll() {
    void loadAnalytics();
    void loadTrainingRecords({
      targetPage: page,
      limit: recordsPerPage,
      username: usernameFilter,
      event: eventFilter,
      search,
    });
    void loadUserProgress();
  }

  async function loadAnalytics() {
    setAnalyticsLoading(true);
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      if (res.status === 503) {
        setAnalyticsAvailable(false);
        return;
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to load analytics.");
      }
      const data = (await res.json()) as AnalyticsData;
      setAnalytics(data);
      setAnalyticsAvailable(true);
    } catch {
      // Silently ignore — analytics sections degrade gracefully
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function loadUserStats() {
    setUserStatsLoading(true);
    setUserStatsError("");
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (res.status === 503) {
        setUserStatsAvailable(false);
        return;
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to load user stats.");
      }
      setUserStats((await res.json()) as UserStat[]);
      setUserStatsAvailable(true);
    } catch (err) {
      setUserStatsError(err instanceof Error ? err.message : "Failed to load user stats.");
    } finally {
      setUserStatsLoading(false);
    }
  }

  async function loadTrainingRecords({
    targetPage,
    limit,
    username,
    event,
    search: searchTerm,
  }: {
    targetPage: number;
    limit: number;
    username: string;
    event: string;
    search: string;
  }) {
    setNeonLoading(true);
    setNeonError("");
    try {
      const params = new URLSearchParams({
        page: String(targetPage),
        limit: String(limit),
      });
      if (username && username !== "all") params.set("username", username);
      if (event && event !== "all") params.set("event", event);
      if (searchTerm.trim()) params.set("search", searchTerm.trim());

      const res = await fetch(`/api/admin/training-records?${params.toString()}`, {
        cache: "no-store",
      });

      if (res.status === 503) {
        setNeonAvailable(false);
        return;
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to load training records.");
      }

      const data = (await res.json()) as {
        records: NeonTrainingRecord[];
        total: number;
        page: number;
        totalPages: number;
      };

      setNeonRecords(data.records);
      setNeonTotal(data.total);
      setNeonTotalPages(data.totalPages);
      setPage(data.page);
      setNeonAvailable(true);
    } catch (err) {
      setNeonError(err instanceof Error ? err.message : "Failed to load training records.");
    } finally {
      setNeonLoading(false);
    }
  }

  async function loadUserProgress() {
    setUserProgressLoading(true);
    try {
      const res = await fetch("/api/admin/user-progress", { cache: "no-store" });
      if (!res.ok) return;
      setUserProgressData((await res.json()) as NeonUserProgress[]);
    } catch {
      // silently ignore
    } finally {
      setUserProgressLoading(false);
    }
  }

  async function loadTrainingUsernames() {
    try {
      const res = await fetch("/api/admin/training-users", { cache: "no-store" });
      if (!res.ok) return;
      setTrainingUsernames((await res.json()) as string[]);
    } catch {
      // silently ignore
    }
  }

  async function deleteUser(userId: string) {
    const userBeforeDelete = userStats.find((u) => u.userId === userId);
    setDeletingUserId(userId);
    setUserStatsError("");
    setDeletedUserInfo(null);
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to delete user conversations.");
      }
      setUserStats((prev) => prev.filter((u) => u.userId !== userId));
      setConfirmDeleteUserId(null);
      if (userBeforeDelete) {
        setDeletedUserInfo({
          userId,
          conversations: userBeforeDelete.conversationCount,
          messages: userBeforeDelete.messageCount,
        });
      }
      void loadAnalytics();
    } catch (err) {
      setUserStatsError(
        err instanceof Error ? err.message : "Failed to delete user conversations."
      );
      setConfirmDeleteUserId(null);
    } finally {
      setDeletingUserId(null);
    }
  }

  async function exportUser(userId: string) {
    setExportingUserId(userId);
    setUserStatsError("");
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/export`);
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Export failed.");
      }
      const data = (await res.json()) as unknown;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${userId}-history.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setUserStatsError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExportingUserId(null);
    }
  }

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <Loader2 className="h-7 w-7 animate-spin text-signal" aria-label="Loading" />
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-lg border border-line bg-white p-7 shadow-panel">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slatePanel text-white">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-ink">Admin Dashboard</h1>
              <p className="text-sm text-slate-600">Training progress access</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Admin Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                autoFocus
              />
            </label>
            {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-signal px-4 py-2.5 font-semibold text-white transition hover:bg-teal-800"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Enter admin dashboard
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-line bg-white/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal">
              LMX Content CMS
            </p>
            <h1 className="text-2xl font-semibold text-ink">Admin Dashboard</h1>
            <p className="mt-1 text-xs text-slate-500">
              User activity, progress, and training questions
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={neonLoading}
              className="flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {neonLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              )}
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5">
        {/* Summary cards — global totals from Neon analytics */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <SummaryCard
            title="Total Users"
            value={analytics?.totalUsers ?? 0}
            icon={<Users className="h-5 w-5" />}
          />
          <SummaryCard
            title="Questions Asked"
            value={analytics?.totalQuestionsAsked ?? 0}
            icon={<Search className="h-5 w-5" />}
          />
          <SummaryCard
            title="Topics Completed"
            value={analytics?.totalCompletedTopics ?? 0}
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <SummaryCard
            title="Quick Answers"
            value={analytics?.totalFaqSelections ?? 0}
            icon={<RefreshCw className="h-5 w-5" />}
          />
          <SummaryCard
            title="Avg Progress"
            value={`${analytics?.averageProgress ?? 0}%`}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <SummaryCard
            title="Latest Activity"
            value={formatMalaysiaTimestamp(analytics?.latestTrainingActivity)}
            small
            icon={<RefreshCw className="h-5 w-5" />}
          />
        </section>

        {/* Training Overview */}
        {analyticsAvailable && (
          <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <div className="mb-4">
              <h2 className="font-semibold text-ink">Training Overview</h2>
              <p className="text-sm text-slate-600">Event counts from Neon training_events.</p>
            </div>
            {analyticsLoading ? (
              <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                Loading…
              </div>
            ) : analytics ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AnalyticCard label="Total Training Events" value={analytics.totalTrainingEvents} />
                <AnalyticCard label="Questions Asked" value={analytics.totalQuestionsAsked} />
                <AnalyticCard label="Topics Completed" value={analytics.totalCompletedTopics} />
                <AnalyticCard label="FAQ Selections" value={analytics.totalFaqSelections} />
              </div>
            ) : null}
          </section>
        )}

        {/* Conversation Analytics */}
        {analyticsAvailable && (
          <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-ink">Conversation Analytics</h2>
                <p className="text-sm text-slate-600">
                  Aggregate stats from the conversation database.
                </p>
              </div>
              <button
                type="button"
                onClick={loadAnalytics}
                disabled={analyticsLoading}
                className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {analyticsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                )}
                Refresh
              </button>
            </div>
            {analyticsLoading ? (
              <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                Loading analytics…
              </div>
            ) : analytics ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <AnalyticCard label="Total Users" value={analytics.totalUsers} />
                <AnalyticCard label="Total Conversations" value={analytics.totalConversations} />
                <AnalyticCard label="Total Messages" value={analytics.totalMessages} />
                <AnalyticCard label="Conversations Today" value={analytics.conversationsToday} />
                <AnalyticCard label="Messages Today" value={analytics.messagesToday} />
                <div className="rounded-md border border-line bg-mist p-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Most Active User
                  </p>
                  {analytics.mostActiveUser ? (
                    <>
                      <p className="mt-1 truncate text-base font-semibold text-ink">
                        {analytics.mostActiveUser.userId}
                      </p>
                      <p className="text-sm text-slate-500">
                        {analytics.mostActiveUser.conversationCount} conversations
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm text-slate-400">No data yet</p>
                  )}
                </div>
              </div>
            ) : null}
          </section>
        )}

        {/* Top Learners */}
        <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-ink">Top Learners</h2>
              <p className="text-sm text-slate-600">
                User progress ranked by completion percentage.
              </p>
            </div>
            <button
              type="button"
              onClick={loadUserProgress}
              disabled={userProgressLoading}
              className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {userProgressLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              )}
              Refresh
            </button>
          </div>
          {userProgressLoading ? (
            <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
              Loading…
            </div>
          ) : userProgressData.length === 0 ? (
            <div className="rounded-md border border-dashed border-line bg-mist px-4 py-6 text-center text-sm text-slate-500">
              No learner progress recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3 font-semibold">Username</th>
                    <th className="px-3 py-3 font-semibold">Full Name</th>
                    <th className="px-3 py-3 font-semibold">Progress</th>
                    <th className="px-3 py-3 font-semibold">Topics Completed</th>
                    <th className="px-3 py-3 font-semibold">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {userProgressData.map((u) => (
                    <tr key={u.username} className="border-b border-line last:border-0">
                      <td className="px-3 py-3 font-medium text-ink">{u.username}</td>
                      <td className="px-3 py-3 text-slate-700">{u.fullName ?? "-"}</td>
                      <td className="px-3 py-3 font-semibold text-ink">
                        {formatProgress(u.progressPercent)}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {u.completedTopics?.length ?? 0}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                        {formatMalaysiaTimestamp(u.lastActiveAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* User Conversation Management */}
        <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-ink">User Conversation Management</h2>
              <p className="text-sm text-slate-600">
                View and delete conversation history stored in the database.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Username
                <select
                  value={userConvFilter}
                  onChange={(e) => setUserConvFilter(e.target.value)}
                  className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                >
                  <option value="all">All</option>
                  {userStats.map((u) => (
                    <option key={u.userId} value={u.userId}>
                      {u.userId}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={loadUserStats}
                disabled={userStatsLoading}
                className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {userStatsLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                )}
                Refresh
              </button>
            </div>
          </div>

          {deletedUserInfo ? (
            <div className="mb-3 flex items-start justify-between gap-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm">
              <div className="text-green-800">
                <p className="font-semibold">Deleted user history:</p>
                <p>
                  User: <span className="font-medium">{deletedUserInfo.userId}</span>
                </p>
                <p>
                  Conversations removed:{" "}
                  <span className="font-medium">{deletedUserInfo.conversations}</span>
                </p>
                <p>
                  Messages removed:{" "}
                  <span className="font-medium">{deletedUserInfo.messages}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeletedUserInfo(null)}
                className="shrink-0 rounded p-0.5 text-green-600 hover:bg-green-100"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          ) : null}

          {!userStatsAvailable ? (
            <div className="rounded-md border border-dashed border-line bg-mist px-4 py-6 text-center text-sm text-slate-500">
              Conversation database is not configured.
            </div>
          ) : userStatsError ? (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {userStatsError}
            </div>
          ) : userStatsLoading ? (
            <div className="flex items-center gap-3 py-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
              Loading user stats…
            </div>
          ) : userStats.length === 0 ? (
            <div className="rounded-md border border-dashed border-line bg-mist px-4 py-6 text-center text-sm text-slate-500">
              No conversation history found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3 font-semibold">Username</th>
                    <th className="px-3 py-3 font-semibold">Conversations</th>
                    <th className="px-3 py-3 font-semibold">Messages</th>
                    <th className="px-3 py-3 font-semibold">Latest Activity</th>
                    <th className="px-3 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userStats
                    .filter((u) => userConvFilter === "all" || u.userId === userConvFilter)
                    .map((user) => (
                    <tr key={user.userId} className="border-b border-line last:border-0">
                      <td className="px-3 py-3 font-medium text-ink">{user.userId}</td>
                      <td className="px-3 py-3 text-slate-700">{user.conversationCount}</td>
                      <td className="px-3 py-3 text-slate-700">{user.messageCount}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                        {user.latestActivity
                          ? formatMalaysiaTimestamp(user.latestActivity)
                          : "-"}
                      </td>
                      <td className="px-3 py-3">
                        {confirmDeleteUserId === user.userId ? (
                          <div className="flex flex-col gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                            <p className="text-xs text-red-700">
                              This will permanently delete all conversation history for this user.
                              This does not delete a login account because user accounts are not
                              implemented yet.
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => deleteUser(user.userId)}
                                disabled={deletingUserId === user.userId}
                                className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                              >
                                {deletingUserId === user.userId ? (
                                  <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                ) : (
                                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                                )}
                                Yes, Delete All
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteUserId(null)}
                                className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => exportUser(user.userId)}
                              disabled={exportingUserId === user.userId}
                              className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 disabled:opacity-60"
                              title="Download conversation history as JSON"
                            >
                              {exportingUserId === user.userId ? (
                                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                              ) : (
                                <Download className="h-3 w-3" aria-hidden="true" />
                              )}
                              Download History
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteUserId(user.userId)}
                              className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" aria-hidden="true" />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Training Records */}
        <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-ink">Training Records</h2>
              <p className="text-sm text-slate-600">Latest records shown first · Neon database</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Username
                <select
                  value={usernameFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setUsernameFilter(val);
                    void loadTrainingRecords({
                      targetPage: 1,
                      limit: recordsPerPage,
                      username: val,
                      event: eventFilter,
                      search,
                    });
                  }}
                  className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                >
                  <option value="all">All</option>
                  {trainingUsernames.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Event
                <select
                  value={eventFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEventFilter(val);
                    void loadTrainingRecords({
                      targetPage: 1,
                      limit: recordsPerPage,
                      username: usernameFilter,
                      event: val,
                      search,
                    });
                  }}
                  className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                >
                  <option value="all">All</option>
                  {EVENT_TYPES.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
              </label>
              <label className="relative block sm:w-80">
                <Search
                  className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearch(val);
                    void loadTrainingRecords({
                      targetPage: 1,
                      limit: recordsPerPage,
                      username: usernameFilter,
                      event: eventFilter,
                      search: val,
                    });
                  }}
                  placeholder="Search username, topic, question..."
                  className="w-full rounded-md border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Records
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setRecordsPerPage(val);
                    void loadTrainingRecords({
                      targetPage: 1,
                      limit: val,
                      username: usernameFilter,
                      event: eventFilter,
                      search,
                    });
                  }}
                  className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
            </div>
          </div>

          {!neonAvailable ? (
            <div className="rounded-md border border-dashed border-line bg-mist px-4 py-6 text-center text-sm text-slate-500">
              Training records database not configured or not yet migrated. Run the Phase 1 SQL
              migration in Neon first.
            </div>
          ) : (
            <>
              {neonError ? (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {neonError}
                </div>
              ) : null}

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-3 py-3 font-semibold">Timestamp</th>
                      <th className="px-3 py-3 font-semibold">Username</th>
                      <th className="px-3 py-3 font-semibold">Event</th>
                      <th className="px-3 py-3 font-semibold">Topic</th>
                      <th className="px-3 py-3 font-semibold">Question</th>
                      <th className="px-3 py-3 font-semibold">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {neonLoading ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-8 text-center text-sm text-slate-500">
                          <Loader2
                            className="mx-auto h-5 w-5 animate-spin text-signal"
                            aria-hidden="true"
                          />
                        </td>
                      </tr>
                    ) : neonRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-8 text-center text-sm text-slate-500"
                        >
                          No records found.
                        </td>
                      </tr>
                    ) : (
                      neonRecords.map((record) => (
                        <tr key={record.id} className="border-b border-line last:border-0">
                          <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                            {formatMalaysiaTimestamp(record.loggedAt)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 font-medium text-ink">
                            {record.username || "-"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                            {record.eventType || "-"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                            {record.topic ?? "-"}
                          </td>
                          <td className="max-w-md px-3 py-3 text-slate-700">
                            {record.question ?? "-"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-700">
                            {formatProgress(record.progressPercent)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  {neonTotal === 0
                    ? "No records"
                    : `Showing ${(page - 1) * recordsPerPage + 1}–${Math.min(
                        page * recordsPerPage,
                        neonTotal
                      )} of ${neonTotal}`}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newPage = Math.max(1, page - 1);
                      setPage(newPage);
                      void loadTrainingRecords({
                        targetPage: newPage,
                        limit: recordsPerPage,
                        username: usernameFilter,
                        event: eventFilter,
                        search,
                      });
                    }}
                    disabled={page <= 1 || neonLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                    title="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {page} of {neonTotalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newPage = Math.min(neonTotalPages, page + 1);
                      setPage(newPage);
                      void loadTrainingRecords({
                        targetPage: newPage,
                        limit: recordsPerPage,
                        username: usernameFilter,
                        event: eventFilter,
                        search,
                      });
                    }}
                    disabled={page >= neonTotalPages || neonLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                    title="Next page"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  small = false,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  small?: boolean;
}) {
  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-panel">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-slatePanel text-white">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className={small ? "mt-1 text-sm font-semibold text-ink" : "mt-1 text-2xl font-semibold text-ink"}>
        {value}
      </p>
    </article>
  );
}

function AnalyticCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-mist p-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value.toLocaleString()}</p>
    </div>
  );
}
