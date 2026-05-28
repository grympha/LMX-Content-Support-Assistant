"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { BarChart3, Loader2, Lock, LogOut, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";

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
  return Array.from(new Set(values.filter(Boolean)));
}

function progressNumber(value: string | number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
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
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to load records.");
    } finally {
      setLoading(false);
    }
  }

  const summary = useMemo(() => {
    const users = unique(records.map((record) => record.username));
    const questions = records.filter((record) => record.eventType === "question_asked").length;
    const completedTopics = records.filter((record) => record.eventType === "topic_completed").length;
    const lastActivity = records[records.length - 1]?.timestamp || "No activity yet";
    const latestProgressByUser = users.map((user) => {
      const userRecords = records.filter((record) => record.username === user);
      return Math.max(...userRecords.map((record) => progressNumber(record.progressPercent)), 0);
    });
    const averageProgress = latestProgressByUser.length
      ? Math.round(latestProgressByUser.reduce((total, value) => total + value, 0) / latestProgressByUser.length)
      : 0;

    return { users: users.length, questions, completedTopics, lastActivity, averageProgress };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    if (!normalizedSearch) {
      return records.slice().reverse();
    }

    return records
      .filter((record) =>
        [record.username, record.eventType, record.topic, record.question, record.details]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      )
      .reverse();
  }, [records, search]);

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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard title="Users" value={summary.users} icon={<Users className="h-5 w-5" />} />
          <SummaryCard title="Questions" value={summary.questions} icon={<Search className="h-5 w-5" />} />
          <SummaryCard title="Completed Topics" value={summary.completedTopics} icon={<ShieldCheck className="h-5 w-5" />} />
          <SummaryCard title="Average Progress" value={`${summary.averageProgress}%`} icon={<BarChart3 className="h-5 w-5" />} />
          <SummaryCard title="Last Activity" value={summary.lastActivity} small icon={<RefreshCw className="h-5 w-5" />} />
        </section>

        <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-ink">Training Records</h2>
              <p className="text-sm text-slate-600">Loaded from Google Sheets</p>
            </div>
            <label className="relative block sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search username, topic, question..."
                className="w-full rounded-md border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              />
            </label>
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
                {filteredRecords.map((record, index) => (
                  <tr key={`${record.timestamp}-${record.username}-${index}`} className="border-b border-line last:border-0">
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">{record.timestamp}</td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-ink">{record.username || "-"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{record.eventType || "-"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{record.topic || "-"}</td>
                    <td className="max-w-md px-3 py-3 text-slate-700">{record.question || record.details || "-"}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700">{record.progressPercent || "-"}</td>
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
