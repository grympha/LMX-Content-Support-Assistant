"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { BarChart3, ChevronLeft, ChevronRight, Loader2, Lock, LogOut, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";

type TrainingRecord = {
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

function unique(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function progressNumber(value: string | number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isEventType(value: string) {
  return ["login", "topic_selected", "topic_completed", "question_asked", "quick_answer_selected"].includes(value);
}

function normalizeRecord(record: TrainingRecord): TrainingRecord {
  // Handles older Apps Script mappings where a Full Name column shifted Event/Topic/Question/Progress values.
  if (!record.eventType && isEventType(String(record.topic))) {
    const shiftedQuestion =
      typeof record.progressPercent === "string" && !Number.isFinite(Number(record.progressPercent))
        ? record.progressPercent
        : "";

    return {
      ...record,
      eventType: String(record.topic),
      topic: String(record.question || ""),
      question: shiftedQuestion,
      progressPercent: shiftedQuestion ? "" : record.completedTopics || record.progressPercent || "",
      completedTopics: record.source || "",
      source: record.details || "",
      details: ""
    };
  }

  return record;
}

function formatProgress(value: string | number) {
  const number = progressNumber(value);
  return number > 0 ? `${number}%` : "-";
}
function timestampValue(timestamp: string) {
  const parsed = Date.parse(timestamp);

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  const match = timestamp.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);

  if (!match) {
    return 0;
  }

  const [, day, month, year, hour, minute, second = "0"] = match;
  return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second)).getTime();
}

export default function AdminDashboard() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [warning, setWarning] = useState("");
  const [search, setSearch] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((response) => response.json())
      .then((data: { authenticated: boolean }) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadRecords();
    }
  }, [authenticated]);

  useEffect(() => {
    setPage(1);
  }, [search, usernameFilter, recordsPerPage]);
  useEffect(() => {
    setPage(1);
  }, [eventFilter]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");

    const response = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setAuthError(data.error ?? "Unable to sign in.");
      return;
    }

    setPassword("");
    setAuthenticated(true);
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setRecords([]);
  }

  async function loadRecords() {
    setLoading(true);
    setLoadError("");
    setWarning("");

    try {
      const response = await fetch("/api/admin/progress", { cache: "no-store" });
      const data = (await response.json()) as { records?: TrainingRecord[]; warning?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load records.");
      }

      setRecords(data.records ?? []);
      setWarning(data.warning ?? "");
      setPage(1);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load records.");
    } finally {
      setLoading(false);
    }
  }

  const sortedRecords = useMemo(
    () => records.map(normalizeRecord).sort((a, b) => timestampValue(b.timestamp) - timestampValue(a.timestamp)),
    [records]
  );

  const usernames = useMemo(() => unique(sortedRecords.map((record) => record.username)), [sortedRecords]);
  const events = useMemo(() => unique(sortedRecords.map((record) => record.eventType)), [sortedRecords]);

  const summary = useMemo(() => {
    const summaryRecords = sortedRecords
      .filter((r) => (usernameFilter === "all" ? true : r.username === usernameFilter))
      .filter((r) => (eventFilter === "all" ? true : r.eventType === eventFilter));
    const users = unique(summaryRecords.map((record) => record.username));
    const questions = summaryRecords.filter((record) => record.eventType === "question_asked").length;
    const quickAnswers = summaryRecords.filter((record) => record.eventType === "quick_answer_selected").length;
    const completedTopicKeys = unique(
      summaryRecords
        .filter((record) => record.eventType === "topic_completed")
        .map((record) => `${record.username}:${record.topic || record.question}`)
    );
    const lastActivity = summaryRecords[0]?.timestamp || "No activity yet";
    const latestProgressByUser = users.map((user) => {
      const userRecords = summaryRecords.filter((record) => record.username === user);
      return Math.max(...userRecords.map((record) => progressNumber(record.progressPercent)), 0);
    });
    const averageProgress = latestProgressByUser.length
      ? Math.round(latestProgressByUser.reduce((total, value) => total + value, 0) / latestProgressByUser.length)
      : 0;

    return { users: users.length, questions, quickAnswers, completedTopics: completedTopicKeys.length, lastActivity, averageProgress };
  }, [sortedRecords, usernameFilter, eventFilter]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    const usernameFilteredRecords = sortedRecords
      .filter((r) => (usernameFilter === "all" ? true : r.username === usernameFilter))
      .filter((r) => (eventFilter === "all" ? true : r.eventType === eventFilter));

    if (!normalizedSearch) {
      return usernameFilteredRecords;
    }

    return usernameFilteredRecords.filter((record) =>
      [record.timestamp, record.username, record.eventType, record.topic, record.question, record.details]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [search, sortedRecords, usernameFilter, eventFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / recordsPerPage));
  const safePage = Math.min(page, totalPages);
  const paginatedRecords = filteredRecords.slice((safePage - 1) * recordsPerPage, safePage * recordsPerPage);

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
                onChange={(event) => setPassword(event.target.value)}
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
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal">LMX Content CMS</p>
            <h1 className="text-2xl font-semibold text-ink">Admin Dashboard</h1>
            <p className="mt-1 text-xs text-slate-500">User activity, progress, and training questions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadRecords}
              disabled={loading}
              className="flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />}
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
        {warning ? <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{warning}</div> : null}
        {loadError ? <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{loadError}</div> : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <SummaryCard title={usernameFilter === "all" ? "Users" : "Selected User"} value={usernameFilter === "all" ? summary.users : usernameFilter} icon={<Users className="h-5 w-5" />} />
          <SummaryCard title="Questions Asked" value={summary.questions} icon={<Search className="h-5 w-5" />} />
          <SummaryCard title="Topics Completed" value={summary.completedTopics} icon={<ShieldCheck className="h-5 w-5" />} />
          <SummaryCard title="Quick Answers Used" value={summary.quickAnswers} icon={<RefreshCw className="h-5 w-5" />} />
          <SummaryCard title="Progress" value={`${summary.averageProgress}%`} icon={<BarChart3 className="h-5 w-5" />} />
          <SummaryCard title="Latest Activity" value={summary.lastActivity} small icon={<RefreshCw className="h-5 w-5" />} />
        </section>

        <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-ink">Training Records</h2>
              <p className="text-sm text-slate-600">Latest records shown first</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Username
                <select
                  value={usernameFilter}
                  onChange={(event) => setUsernameFilter(event.target.value)}
                  className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                >
                  <option value="all">All</option>
                  {usernames.map((username) => (
                    <option key={username} value={username}>
                      {username}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Event
                <select
                  value={eventFilter}
                  onChange={(event) => setEventFilter(event.target.value)}
                  className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                >
                  <option value="all">All</option>
                  {events.map((eventType) => (
                    <option key={eventType} value={eventType}>
                      {eventType}
                    </option>
                  ))}
                </select>
              </label>
              <label className="relative block sm:w-80">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search username, topic, question..."
                  className="w-full rounded-md border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                Records
                <select
                  value={recordsPerPage}
                  onChange={(event) => setRecordsPerPage(Number(event.target.value))}
                  className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>
            </div>
          </div>

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
                {paginatedRecords.map((record, index) => (
                  <tr key={`${record.timestamp}-${record.username}-${index}`} className="border-b border-line last:border-0">
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">{record.timestamp}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-ink">{record.username || "-"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{record.eventType || "-"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{record.topic || "-"}</td>
                    <td className="max-w-md px-3 py-3 text-slate-700">{record.question || record.details || "-"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{formatProgress(record.progressPercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="rounded-md border border-dashed border-line bg-mist px-4 py-8 text-center text-sm text-slate-500">
              No records found yet.
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing {filteredRecords.length === 0 ? 0 : (safePage - 1) * recordsPerPage + 1} - {Math.min(safePage * recordsPerPage, filteredRecords.length)} of {filteredRecords.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="text-sm text-slate-600">Page {safePage} of {totalPages}</span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={safePage === totalPages}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({ title, value, icon, small = false }: { title: string; value: string | number; icon: ReactNode; small?: boolean }) {
  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-panel">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-slatePanel text-white">{icon}</div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className={small ? "mt-1 text-sm font-semibold text-ink" : "mt-1 text-2xl font-semibold text-ink"}>{value}</p>
    </article>
  );
}
