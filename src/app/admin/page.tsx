"use client";

import { FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  HelpCircle,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/Logo";

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminTab = "overview" | "feedback" | "users" | "training" | "learned";

type UserStat = {
  userId: string;
  conversationCount: number;
  messageCount: number;
  latestActivity: string | null;
  topicsCompleted?: number;
  goodFeedback?: number;
  badFeedback?: number;
};

type TrendData = {
  current: number;
  previous: number;
  pct: number;
  direction: "up" | "down" | "flat";
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
  avgConversationsPerUser: number;
  avgMessagesPerConversation: number;
  newestConversation: string | null;
  oldestConversation: string | null;
  questionsAskedTrend?: TrendData | null;
  completedTopicsTrend?: TrendData | null;
  faqSelectionsTrend?: TrendData | null;
  dau?: number;
  wau?: number;
  mau?: number;
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

type TrainingUserStat = {
  username: string;
  trainingEventCount: number;
  completedTopicCount: number;
  latestActivity: string | null;
};

type FeedbackRecord = {
  id: string;
  username: string;
  conversationId: string | null;
  messageId: string | null;
  question: string | null;
  response: string | null;
  rating: string;
  aiProvider: string | null;
  sources: string[] | null;
  createdAt: string;
};

type FeedbackSummary = {
  total: number;
  good: number;
  bad: number;
  goodRate: number;
};

type TopicStat = { topic: string; selections: number };
type TopicAnalyticsData = { topTopics: TopicStat[]; bottomTopics: TopicStat[] };

type FeedbackIntelligenceData = {
  topBadQuestions: Array<{ question: string; count: number }>;
  topGoodQuestions: Array<{ question: string; count: number }>;
  topBadTopics: Array<{ source: string; count: number }>;
};

type KnowledgeCoverageData = {
  totalTopics: number;
  topicsAccessed: number;
  topicsNeverAccessed: number;
  coveragePercent: number;
  mostAccessedTopic: string | null;
  leastAccessedTopic: string | null;
  neverAccessedTopics: string[];
};

type SearchAnalyticsData = {
  topQuestions: Array<{ question: string; count: number; lastAsked: string | null }>;
};

type LearnedAnswerRecord = {
  id: string;
  normalizedQuestion: string;
  originalQuestion: string;
  response: string;
  status: string;
  reusedCount: number;
  username: string | null;
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
};

type LearnedAnswersSummary = {
  candidates: number;
  approved: number;
  rejected: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  "login",
  "topic_selected",
  "topic_completed",
  "question_asked",
  "quick_answer_selected",
] as const;

const TABS: { id: AdminTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "feedback", label: "Feedback" },
  { id: "users", label: "Users" },
  { id: "training", label: "Training" },
  { id: "learned", label: "Learned Answers" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function progressNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
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

function getHealthStatus(goodRate: number) {
  if (goodRate >= 95) return { label: "🟢 Excellent", classes: "bg-green-100 text-green-700" };
  if (goodRate >= 80) return { label: "🟢 Good", classes: "bg-teal-100 text-teal-700" };
  if (goodRate >= 60) return { label: "🟠 Needs Review", classes: "bg-yellow-100 text-yellow-800" };
  return { label: "🔴 Critical", classes: "bg-red-100 text-red-700" };
}

function getTopicRecommendation(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("pull") || s.includes("ptc")) return "Review Pull To Content setup workflow";
  if (s.includes("pair") || s.includes("device")) return "Expand device troubleshooting steps";
  if (s.includes("schedule") || s.includes("content")) return "Review content scheduling workflow";
  if (s.includes("playlog")) return "Expand playlog documentation";
  if (s.includes("install")) return "Review installation guide";
  if (s.includes("publish")) return "Expand publishing checklist";
  if (s.includes("vast") || s.includes("programmatic")) return "Review VAST/programmatic setup guide";
  if (s.includes("user") || s.includes("permission")) return "Clarify user roles and permissions";
  if (s.includes("layout") || s.includes("playlist")) return "Review layout and playlist configuration";
  return "Review knowledge article and improve response quality";
}

// Convert stored lowercase username (e.g. "john.smith") to display name ("John Smith")
function toDisplayName(username: string): string {
  return username
    .split(".")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ")
    .trim();
}

function rankBadge(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return String(rank);
}

function downloadAsCsv(rows: Record<string, unknown>[], filename: string) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = String(row[h] ?? "").replace(/"/g, '""');
          return `"${val}"`;
        })
        .join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadAsXlsx(rows: Record<string, unknown>[], sheetName: string, filename: string) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Active tab
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Training records
  const [neonRecords, setNeonRecords] = useState<NeonTrainingRecord[]>([]);
  const [neonLoading, setNeonLoading] = useState(false);
  const [neonError, setNeonError] = useState("");
  const [neonTotal, setNeonTotal] = useState(0);
  const [neonTotalPages, setNeonTotalPages] = useState(1);
  const [neonAvailable, setNeonAvailable] = useState(true);

  // User progress
  const [userProgressData, setUserProgressData] = useState<NeonUserProgress[]>([]);
  const [userProgressLoading, setUserProgressLoading] = useState(false);

  // Filters for training records
  const [search, setSearch] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(50);

  // Training user stats
  const [trainingUserStats, setTrainingUserStats] = useState<TrainingUserStat[]>([]);

  // User management
  const [userStats, setUserStats] = useState<UserStat[]>([]);
  const [userConvFilter, setUserConvFilter] = useState("all");
  const [userConvSearch, setUserConvSearch] = useState("");
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

  // Training user management
  const [confirmDeleteTrainingUser, setConfirmDeleteTrainingUser] = useState<string | null>(null);
  const [deletingTrainingUser, setDeletingTrainingUser] = useState<string | null>(null);
  const [deletedTrainingUserInfo, setDeletedTrainingUserInfo] = useState<{
    username: string;
    deletedEvents: number;
    deletedProgress: number;
  } | null>(null);
  const [trainingUserStatsLoading, setTrainingUserStatsLoading] = useState(false);

  // Analytics
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsAvailable, setAnalyticsAvailable] = useState(true);

  // Feedback
  const [feedbackRecords, setFeedbackRecords] = useState<FeedbackRecord[]>([]);
  const [feedbackSummary, setFeedbackSummary] = useState<FeedbackSummary | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackAvailable, setFeedbackAvailable] = useState(true);
  const [feedbackTotal, setFeedbackTotal] = useState(0);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState("all");
  const [feedbackUsernameFilter, setFeedbackUsernameFilter] = useState("all");
  const [feedbackSearch, setFeedbackSearch] = useState("");

  // Topic analytics
  const [topicAnalytics, setTopicAnalytics] = useState<TopicAnalyticsData | null>(null);
  const [topicAnalyticsLoading, setTopicAnalyticsLoading] = useState(false);

  // Feedback intelligence
  const [feedbackIntelligence, setFeedbackIntelligence] =
    useState<FeedbackIntelligenceData | null>(null);
  const [feedbackIntelligenceLoading, setFeedbackIntelligenceLoading] = useState(false);

  // Knowledge coverage
  const [knowledgeCoverage, setKnowledgeCoverage] = useState<KnowledgeCoverageData | null>(null);
  const [knowledgeCoverageLoading, setKnowledgeCoverageLoading] = useState(false);

  // Search analytics
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalyticsData | null>(null);
  const [searchAnalyticsLoading, setSearchAnalyticsLoading] = useState(false);

  // Export states
  const [exportingTraining, setExportingTraining] = useState(false);
  const [exportingFeedback, setExportingFeedback] = useState(false);

  // Learned answers
  const [learnedRecords, setLearnedRecords] = useState<LearnedAnswerRecord[]>([]);
  const [learnedSummary, setLearnedSummary] = useState<LearnedAnswersSummary | null>(null);
  const [learnedLoading, setLearnedLoading] = useState(false);
  const [learnedTotal, setLearnedTotal] = useState(0);
  const [learnedTotalPages, setLearnedTotalPages] = useState(1);
  const [learnedPage, setLearnedPage] = useState(1);
  const [learnedStatusFilter, setLearnedStatusFilter] = useState("all");
  const [learnedActingId, setLearnedActingId] = useState<string | null>(null);
  const [editingLearnedId, setEditingLearnedId] = useState<string | null>(null);
  const [editingLearnedResponse, setEditingLearnedResponse] = useState("");

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
      void loadTrainingUserStats();
      void loadTrainingRecords({
        targetPage: 1,
        limit: recordsPerPage,
        username: "all",
        event: "all",
        search: "",
      });
      void loadUserProgress();
      void loadFeedback({ targetPage: 1, rating: "all", username: "all", search: "" });
      void loadTopicAnalytics();
      void loadFeedbackIntelligence();
      void loadKnowledgeCoverage();
      void loadSearchAnalytics();
      void loadLearnedAnswers({ page: 1, status: "all" });
    }
  }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Auth handlers ──────────────────────────────────────────────────────────

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
    void loadAnalytics(usernameFilter);
    void loadTrainingRecords({
      targetPage: page,
      limit: recordsPerPage,
      username: usernameFilter,
      event: eventFilter,
      search,
    });
    void loadUserProgress();
    void loadTrainingUserStats();
    void loadFeedback({
      targetPage: feedbackPage,
      rating: feedbackRatingFilter,
      username: feedbackUsernameFilter,
      search: feedbackSearch,
    });
    void loadTopicAnalytics();
    void loadFeedbackIntelligence();
    void loadKnowledgeCoverage();
    void loadSearchAnalytics();
    void loadLearnedAnswers({ page: learnedPage, status: learnedStatusFilter });
  }

  // ─── Data loaders ───────────────────────────────────────────────────────────

  async function loadAnalytics(username?: string) {
    setAnalyticsLoading(true);
    try {
      const params = new URLSearchParams();
      if (username && username !== "all") params.set("username", username);
      const qs = params.toString();
      const res = await fetch(`/api/admin/analytics${qs ? `?${qs}` : ""}`, {
        cache: "no-store",
      });
      if (res.status === 503) { setAnalyticsAvailable(false); return; }
      if (!res.ok) throw new Error();
      setAnalytics((await res.json()) as AnalyticsData);
      setAnalyticsAvailable(true);
    } catch {
      // silently degrade
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function loadUserStats() {
    setUserStatsLoading(true);
    setUserStatsError("");
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      if (res.status === 503) { setUserStatsAvailable(false); return; }
      if (!res.ok) throw new Error((await res.json() as { error?: string }).error ?? "Failed to load user stats.");
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
      const params = new URLSearchParams({ page: String(targetPage), limit: String(limit) });
      if (username && username !== "all") params.set("username", username);
      if (event && event !== "all") params.set("event", event);
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      const res = await fetch(`/api/admin/training-records?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.status === 503) { setNeonAvailable(false); return; }
      if (!res.ok) throw new Error((await res.json() as { error?: string }).error ?? "Failed to load records.");
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

  async function loadTrainingUserStats() {
    setTrainingUserStatsLoading(true);
    try {
      const res = await fetch("/api/admin/training-users", { cache: "no-store" });
      if (!res.ok) return;
      setTrainingUserStats((await res.json()) as TrainingUserStat[]);
    } catch {
      // silently ignore
    } finally {
      setTrainingUserStatsLoading(false);
    }
  }

  async function loadFeedback({
    targetPage,
    rating,
    username,
    search: searchTerm,
  }: {
    targetPage: number;
    rating: string;
    username: string;
    search: string;
  }) {
    setFeedbackLoading(true);
    try {
      const params = new URLSearchParams({ page: String(targetPage), limit: "50" });
      if (rating && rating !== "all") params.set("rating", rating);
      if (username && username !== "all") params.set("username", username);
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      const res = await fetch(`/api/admin/feedback?${params.toString()}`, { cache: "no-store" });
      if (res.status === 503) { setFeedbackAvailable(false); return; }
      if (!res.ok) return;
      const data = (await res.json()) as {
        records: FeedbackRecord[];
        total: number;
        page: number;
        totalPages: number;
        summary: FeedbackSummary;
      };
      setFeedbackRecords(data.records);
      setFeedbackTotal(data.total);
      setFeedbackPage(data.page);
      setFeedbackTotalPages(data.totalPages);
      setFeedbackSummary(data.summary);
      setFeedbackAvailable(true);
    } catch {
      // silently ignore
    } finally {
      setFeedbackLoading(false);
    }
  }

  async function loadTopicAnalytics() {
    setTopicAnalyticsLoading(true);
    try {
      const res = await fetch("/api/admin/topic-analytics", { cache: "no-store" });
      if (!res.ok) return;
      setTopicAnalytics((await res.json()) as TopicAnalyticsData);
    } catch {
      // silently ignore
    } finally {
      setTopicAnalyticsLoading(false);
    }
  }

  async function loadFeedbackIntelligence() {
    setFeedbackIntelligenceLoading(true);
    try {
      const res = await fetch("/api/admin/feedback-intelligence", { cache: "no-store" });
      if (!res.ok) return;
      setFeedbackIntelligence((await res.json()) as FeedbackIntelligenceData);
    } catch {
      // silently ignore
    } finally {
      setFeedbackIntelligenceLoading(false);
    }
  }

  async function loadKnowledgeCoverage() {
    setKnowledgeCoverageLoading(true);
    try {
      const res = await fetch("/api/admin/knowledge-coverage", { cache: "no-store" });
      if (!res.ok) return;
      setKnowledgeCoverage((await res.json()) as KnowledgeCoverageData);
    } catch {
      // silently ignore
    } finally {
      setKnowledgeCoverageLoading(false);
    }
  }

  async function loadSearchAnalytics() {
    setSearchAnalyticsLoading(true);
    try {
      const res = await fetch("/api/admin/search-analytics", { cache: "no-store" });
      if (!res.ok) return;
      setSearchAnalytics((await res.json()) as SearchAnalyticsData);
    } catch {
      // silently ignore
    } finally {
      setSearchAnalyticsLoading(false);
    }
  }

  async function loadLearnedAnswers({ page: targetPage, status }: { page: number; status: string }) {
    setLearnedLoading(true);
    try {
      const params = new URLSearchParams({ page: String(targetPage), limit: "20" });
      if (status && status !== "all") params.set("status", status);
      const res = await fetch(`/api/admin/learned-answers?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as {
        records: LearnedAnswerRecord[];
        total: number;
        totalPages: number;
        page: number;
        summary: LearnedAnswersSummary;
      };
      setLearnedRecords(data.records);
      setLearnedTotal(data.total);
      setLearnedTotalPages(data.totalPages);
      setLearnedPage(data.page);
      setLearnedSummary(data.summary);
    } catch {
      // silently ignore
    } finally {
      setLearnedLoading(false);
    }
  }

  async function approveLearnedAnswer(id: string) {
    setLearnedActingId(id);
    try {
      const res = await fetch(`/api/admin/learned-answers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (!res.ok) return;
      void loadLearnedAnswers({ page: learnedPage, status: learnedStatusFilter });
    } finally {
      setLearnedActingId(null);
    }
  }

  async function rejectLearnedAnswer(id: string) {
    setLearnedActingId(id);
    try {
      const res = await fetch(`/api/admin/learned-answers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (!res.ok) return;
      void loadLearnedAnswers({ page: learnedPage, status: learnedStatusFilter });
    } finally {
      setLearnedActingId(null);
    }
  }

  async function deleteLearnedAnswer(id: string) {
    setLearnedActingId(id);
    try {
      const res = await fetch(`/api/admin/learned-answers/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      void loadLearnedAnswers({ page: learnedPage, status: learnedStatusFilter });
    } finally {
      setLearnedActingId(null);
    }
  }

  async function saveLearnedAnswerEdit(id: string) {
    setLearnedActingId(id);
    try {
      const res = await fetch(`/api/admin/learned-answers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: editingLearnedResponse }),
      });
      if (!res.ok) return;
      setEditingLearnedId(null);
      void loadLearnedAnswers({ page: learnedPage, status: learnedStatusFilter });
    } finally {
      setLearnedActingId(null);
    }
  }

  async function exportTraining(format: "csv" | "xlsx") {
    setExportingTraining(true);
    try {
      const params = new URLSearchParams({ export: "true" });
      if (usernameFilter && usernameFilter !== "all") params.set("username", usernameFilter);
      if (eventFilter && eventFilter !== "all") params.set("event", eventFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/training-records?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { records: NeonTrainingRecord[] };
      const rows = data.records.map((r) => ({
        Timestamp: formatMalaysiaTimestamp(r.loggedAt),
        Username: r.username ?? "",
        "Full Name": r.fullName ?? "",
        Event: r.eventType ?? "",
        Topic: r.topic ?? "",
        Question: r.question ?? "",
        "Progress %": r.progressPercent != null ? Math.round(Number(r.progressPercent)) : "",
      }));
      if (format === "csv") {
        downloadAsCsv(rows as Record<string, unknown>[], "training-records.csv");
      } else {
        await downloadAsXlsx(rows as Record<string, unknown>[], "Training Records", "training-records.xlsx");
      }
    } catch {
      // silently ignore
    } finally {
      setExportingTraining(false);
    }
  }

  async function exportFeedback(format: "csv" | "xlsx") {
    setExportingFeedback(true);
    try {
      const params = new URLSearchParams({ export: "true" });
      if (feedbackRatingFilter && feedbackRatingFilter !== "all") params.set("rating", feedbackRatingFilter);
      if (feedbackUsernameFilter && feedbackUsernameFilter !== "all") params.set("username", feedbackUsernameFilter);
      if (feedbackSearch.trim()) params.set("search", feedbackSearch.trim());
      const res = await fetch(`/api/admin/feedback?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { records: FeedbackRecord[] };
      const rows = data.records.map((r) => ({
        Timestamp: formatMalaysiaTimestamp(r.createdAt),
        Username: r.username,
        Rating: r.rating,
        Question: r.question ?? "",
        Response: r.response ? r.response.slice(0, 200) : "",
        "AI Provider": r.aiProvider ?? "",
        Sources: r.sources?.join("; ") ?? "",
      }));
      if (format === "csv") {
        downloadAsCsv(rows as Record<string, unknown>[], "feedback.csv");
      } else {
        await downloadAsXlsx(rows as Record<string, unknown>[], "Feedback", "feedback.xlsx");
      }
    } catch {
      // silently ignore
    } finally {
      setExportingFeedback(false);
    }
  }

  function exportUserActivity(format: "csv" | "xlsx") {
    const rows = filteredUserStats.map((u) => ({
      Username: u.userId,
      Conversations: u.conversationCount,
      Messages: u.messageCount,
      "Topics Completed": u.topicsCompleted ?? 0,
      "Good Feedback": u.goodFeedback ?? 0,
      "Bad Feedback": u.badFeedback ?? 0,
      "Latest Activity": u.latestActivity ? formatMalaysiaTimestamp(u.latestActivity) : "",
    }));
    if (format === "csv") {
      downloadAsCsv(rows as Record<string, unknown>[], "user-activity.csv");
    } else {
      void downloadAsXlsx(rows as Record<string, unknown>[], "User Activity", "user-activity.xlsx");
    }
  }

  // ─── Delete / export ────────────────────────────────────────────────────────

  async function deleteTrainingUser(username: string) {
    setDeletingTrainingUser(username);
    setDeletedTrainingUserInfo(null);
    try {
      const res = await fetch(`/api/admin/training-users/${encodeURIComponent(username)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json() as { error?: string }).error ?? "Failed.");
      const data = (await res.json()) as { deletedEvents: number; deletedProgress: number };
      setTrainingUserStats((prev) => prev.filter((u) => u.username !== username));
      setConfirmDeleteTrainingUser(null);
      setDeletedTrainingUserInfo({ username, ...data });
      void loadAnalytics(usernameFilter !== username ? usernameFilter : "all");
      if (usernameFilter === username) {
        setUsernameFilter("all");
        void loadTrainingRecords({ targetPage: 1, limit: recordsPerPage, username: "all", event: eventFilter, search });
      }
    } catch (err) {
      console.error(err);
      setConfirmDeleteTrainingUser(null);
    } finally {
      setDeletingTrainingUser(null);
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
      if (!res.ok) throw new Error((await res.json() as { error?: string }).error ?? "Failed.");
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
      setUserStatsError(err instanceof Error ? err.message : "Failed to delete user conversations.");
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
      if (!res.ok) throw new Error((await res.json() as { error?: string }).error ?? "Export failed.");
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

  // ─── Login screen ────────────────────────────────────────────────────────────

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
          <div className="mb-6 flex items-center gap-4">
            <Logo size="sm" className="w-[60px] sm:w-[100px]" clickable={false} />
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

  // ─── Authenticated dashboard ──────────────────────────────────────────────

  const filteredUserStats = userStats.filter((u) => {
    if (userConvFilter !== "all" && u.userId !== userConvFilter) return false;
    if (userConvSearch.trim()) {
      return u.userId.toLowerCase().includes(userConvSearch.toLowerCase());
    }
    return true;
  });

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-line bg-white/90 px-4 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-[48px] sm:w-[64px]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-signal">
                LMX Content CMS
              </p>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold leading-tight text-ink">Admin Dashboard</h1>
                <span className="rounded-full bg-slatePanel px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-500">
                User activity, progress and training analytics
              </p>
            </div>
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

      {/* Tab bar */}
      <div className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex overflow-x-auto" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 border-b-2 px-5 py-3 text-sm font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-signal text-signal"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-5">

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <>
            {/* Username filter banner */}
            {usernameFilter !== "all" && (
              <div className="flex items-center gap-2 rounded-md border border-signal/30 bg-signal/5 px-3 py-2 text-sm text-signal">
                <span className="font-medium">Showing data for:</span>
                <span className="font-semibold">{usernameFilter}</span>
                <button
                  type="button"
                  onClick={() => {
                    setUsernameFilter("all");
                    void loadAnalytics("all");
                    void loadTrainingRecords({ targetPage: 1, limit: recordsPerPage, username: "all", event: eventFilter, search });
                  }}
                  className="ml-auto rounded px-2 py-0.5 text-xs font-medium text-signal hover:bg-signal/10"
                >
                  Clear filter
                </button>
              </div>
            )}

            {/* KPI Cards */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              <SummaryCard
                title="Total Users"
                subtitle="Active learners"
                value={analytics?.totalUsers ?? 0}
                icon={<Users className="h-5 w-5" />}
              />
              <SummaryCard
                title="Questions Asked"
                subtitle="Training questions submitted"
                value={analytics?.totalQuestionsAsked ?? 0}
                icon={<HelpCircle className="h-5 w-5" />}
                trend={analytics?.questionsAskedTrend ?? undefined}
              />
              <SummaryCard
                title="Topics Completed"
                subtitle="Completed learning modules"
                value={analytics?.totalCompletedTopics ?? 0}
                icon={<BookOpen className="h-5 w-5" />}
                trend={analytics?.completedTopicsTrend ?? undefined}
              />
              <SummaryCard
                title="Quick Answers"
                subtitle="FAQ selections"
                value={analytics?.totalFaqSelections ?? 0}
                icon={<Zap className="h-5 w-5" />}
                trend={analytics?.faqSelectionsTrend ?? undefined}
              />
              <SummaryCard
                title="Avg Progress"
                subtitle="Across all learners"
                value={`${analytics?.averageProgress ?? 0}%`}
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <SummaryCard
                title="Latest Activity"
                subtitle="Most recent learning event"
                value={formatMalaysiaTimestamp(analytics?.latestTrainingActivity)}
                small
                icon={<Clock className="h-5 w-5" />}
              />
            </section>

            {/* Knowledge Health */}
            {feedbackAvailable && (
              <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-ink">Knowledge Health</h2>
                    <p className="text-sm text-slate-600">
                      AI response quality based on learner feedback.
                    </p>
                  </div>
                  {feedbackSummary && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getHealthStatus(feedbackSummary.goodRate).classes}`}
                    >
                      {getHealthStatus(feedbackSummary.goodRate).label}
                    </span>
                  )}
                </div>
                {feedbackLoading || feedbackIntelligenceLoading ? (
                  <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                    Loading…
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Stats */}
                    <div className="space-y-3">
                      <HealthStatRow
                        emoji="👍"
                        label="Good Responses"
                        value={feedbackSummary?.good ?? 0}
                        color="text-green-600"
                      />
                      <HealthStatRow
                        emoji="👎"
                        label="Bad Responses"
                        value={feedbackSummary?.bad ?? 0}
                        color="text-red-500"
                      />
                      <HealthStatRow
                        emoji="📊"
                        label="Success Rate"
                        value={`${feedbackSummary?.goodRate ?? 0}%`}
                        color="text-signal"
                      />
                    </div>

                    {/* Top Bad Topics */}
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Top Bad Topics
                      </p>
                      {feedbackIntelligence?.topBadTopics && feedbackIntelligence.topBadTopics.length > 0 ? (
                        <div className="space-y-2">
                          {feedbackIntelligence.topBadTopics.map((t, i) => (
                            <div key={t.source} className="rounded-md border border-line bg-mist p-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-4 shrink-0 text-xs text-slate-400">{i + 1}.</span>
                                <span className="flex-1 truncate text-sm font-medium text-slate-700">{t.source}</span>
                                <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                  {t.count}
                                </span>
                              </div>
                              <p className="mt-1 pl-6 text-xs text-slate-500">
                                → {getTopicRecommendation(t.source)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">No bad feedback yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Knowledge Coverage + User Engagement — two-column on large screens */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Knowledge Coverage */}
              <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-ink">Knowledge Coverage</h2>
                    <p className="text-sm text-slate-600">Topics accessed vs available.</p>
                  </div>
                  {knowledgeCoverage && (
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${knowledgeCoverage.coveragePercent >= 80 ? "bg-green-100 text-green-700" : knowledgeCoverage.coveragePercent >= 50 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-700"}`}>
                      {knowledgeCoverage.coveragePercent}% Coverage
                    </span>
                  )}
                </div>
                {knowledgeCoverageLoading ? (
                  <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                    Loading…
                  </div>
                ) : knowledgeCoverage ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-md border border-line bg-mist p-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Available</p>
                        <p className="mt-1 text-2xl font-semibold text-ink">{knowledgeCoverage.totalTopics}</p>
                      </div>
                      <div className="rounded-md border border-line bg-mist p-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Accessed</p>
                        <p className="mt-1 text-2xl font-semibold text-signal">{knowledgeCoverage.topicsAccessed}</p>
                      </div>
                      <div className="rounded-md border border-line bg-mist p-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Never Used</p>
                        <p className="mt-1 text-2xl font-semibold text-red-500">{knowledgeCoverage.topicsNeverAccessed}</p>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-signal transition-all" style={{ width: `${knowledgeCoverage.coveragePercent}%` }} />
                    </div>
                    <div className="grid gap-2 text-sm">
                      {knowledgeCoverage.mostAccessedTopic && (
                        <p className="text-slate-600"><span className="font-medium text-ink">Most Accessed:</span> {knowledgeCoverage.mostAccessedTopic}</p>
                      )}
                      {knowledgeCoverage.leastAccessedTopic && (
                        <p className="text-slate-600"><span className="font-medium text-ink">Least Accessed:</span> {knowledgeCoverage.leastAccessedTopic}</p>
                      )}
                      {knowledgeCoverage.neverAccessedTopics.length > 0 && (
                        <details className="mt-1">
                          <summary className="cursor-pointer text-xs text-slate-400 hover:text-slate-600">
                            {knowledgeCoverage.neverAccessedTopics.length} topic{knowledgeCoverage.neverAccessedTopics.length !== 1 ? "s" : ""} never accessed
                          </summary>
                          <ul className="mt-2 space-y-1 pl-3">
                            {knowledgeCoverage.neverAccessedTopics.map((t) => (
                              <li key={t} className="text-xs text-slate-500">• {t}</li>
                            ))}
                          </ul>
                        </details>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No coverage data yet.</p>
                )}
              </section>

              {/* User Engagement DAU/WAU/MAU */}
              <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
                <div className="mb-4">
                  <h2 className="font-semibold text-ink">User Engagement</h2>
                  <p className="text-sm text-slate-600">Active user counts by time window.</p>
                </div>
                {analyticsLoading ? (
                  <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                    Loading…
                  </div>
                ) : analytics ? (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-md border border-line bg-mist p-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">DAU</p>
                      <p className="mt-1 text-3xl font-semibold text-ink">{analytics.dau ?? 0}</p>
                      <p className="mt-1 text-xs text-slate-400">Active today</p>
                    </div>
                    <div className="rounded-md border border-line bg-mist p-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">WAU</p>
                      <p className="mt-1 text-3xl font-semibold text-signal">{analytics.wau ?? 0}</p>
                      <p className="mt-1 text-xs text-slate-400">Last 7 days</p>
                    </div>
                    <div className="rounded-md border border-line bg-mist p-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">MAU</p>
                      <p className="mt-1 text-3xl font-semibold text-ink">{analytics.mau ?? 0}</p>
                      <p className="mt-1 text-xs text-slate-400">Last 30 days</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">No engagement data yet.</p>
                )}
              </section>
            </div>

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
                    onClick={() => void loadAnalytics(usernameFilter)}
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
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <AnalyticCard label="Total Users" value={analytics.totalUsers} />
                    <AnalyticCard label="Total Conversations" value={analytics.totalConversations} />
                    <AnalyticCard label="Total Messages" value={analytics.totalMessages} />
                    <AnalyticCard label="Conversations Today" value={analytics.conversationsToday} />
                    <AnalyticCard label="Messages Today" value={analytics.messagesToday} />
                    <AnalyticCard
                      label="Avg Conversations / User"
                      value={analytics.avgConversationsPerUser}
                      decimal
                    />
                    <AnalyticCard
                      label="Avg Messages / Conversation"
                      value={analytics.avgMessagesPerConversation}
                      decimal
                    />
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
                    <div className="rounded-md border border-line bg-mist p-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Newest Conversation
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {formatMalaysiaTimestamp(analytics.newestConversation)}
                      </p>
                    </div>
                    <div className="rounded-md border border-line bg-mist p-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Oldest Conversation
                      </p>
                      <p className="mt-1 text-sm font-medium text-ink">
                        {formatMalaysiaTimestamp(analytics.oldestConversation)}
                      </p>
                    </div>
                  </div>
                ) : null}
              </section>
            )}
          </>
        )}

        {/* ── FEEDBACK TAB ──────────────────────────────────────────────────── */}
        {activeTab === "feedback" && (
          <>
            {/* Feedback Intelligence */}
            <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
              <div className="mb-4">
                <h2 className="font-semibold text-ink">Feedback Intelligence</h2>
                <p className="text-sm text-slate-600">
                  Questions with recurring bad or good feedback — identifies knowledge gaps.
                </p>
              </div>
              {feedbackIntelligenceLoading ? (
                <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                  Loading…
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Top bad questions */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Questions Receiving Bad Feedback
                    </p>
                    {feedbackIntelligence?.topBadQuestions && feedbackIntelligence.topBadQuestions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                              <th className="px-3 py-2 text-left font-semibold">#</th>
                              <th className="px-3 py-2 text-left font-semibold">Question</th>
                              <th className="px-3 py-2 text-right font-semibold">Bad Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {feedbackIntelligence.topBadQuestions.map((q, i) => (
                              <tr key={i} className="border-b border-line last:border-0">
                                <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                                <td className="max-w-sm px-3 py-2 text-slate-700">
                                  <span className="line-clamp-2">{q.question}</span>
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
                                    {q.count}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No bad feedback recorded yet.</p>
                    )}
                  </div>

                  {/* Most helpful answers */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Most Helpful Answers
                    </p>
                    {feedbackIntelligence?.topGoodQuestions && feedbackIntelligence.topGoodQuestions.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                              <th className="px-3 py-2 text-left font-semibold">#</th>
                              <th className="px-3 py-2 text-left font-semibold">Question</th>
                              <th className="px-3 py-2 text-right font-semibold">Good Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {feedbackIntelligence.topGoodQuestions.map((q, i) => (
                              <tr key={i} className="border-b border-line last:border-0">
                                <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                                <td className="max-w-sm px-3 py-2 text-slate-700">
                                  <span className="line-clamp-2">{q.question}</span>
                                </td>
                                <td className="px-3 py-2 text-right">
                                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-600">
                                    {q.count}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No good feedback recorded yet.</p>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* Assistant Feedback table */}
            {feedbackAvailable && (
              <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-semibold text-ink">Assistant Feedback</h2>
                    <p className="text-sm text-slate-600">User ratings on assistant responses.</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      Rating
                      <select
                        value={feedbackRatingFilter}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFeedbackRatingFilter(val);
                          void loadFeedback({ targetPage: 1, rating: val, username: feedbackUsernameFilter, search: feedbackSearch });
                        }}
                        className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                      >
                        <option value="all">All</option>
                        <option value="good">Good</option>
                        <option value="bad">Bad</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      Username
                      <select
                        value={feedbackUsernameFilter}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFeedbackUsernameFilter(val);
                          void loadFeedback({ targetPage: 1, rating: feedbackRatingFilter, username: val, search: feedbackSearch });
                        }}
                        className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                      >
                        <option value="all">All</option>
                        {Array.from(new Set(feedbackRecords.map((r) => r.username))).sort().map((u) => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </label>
                    <label className="relative block sm:w-64">
                      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                      <input
                        value={feedbackSearch}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFeedbackSearch(val);
                          void loadFeedback({ targetPage: 1, rating: feedbackRatingFilter, username: feedbackUsernameFilter, search: val });
                        }}
                        placeholder="Search question or response..."
                        className="w-full rounded-md border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => void loadFeedback({ targetPage: feedbackPage, rating: feedbackRatingFilter, username: feedbackUsernameFilter, search: feedbackSearch })}
                      disabled={feedbackLoading}
                      className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {feedbackLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />}
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={() => void exportFeedback("csv")}
                      disabled={exportingFeedback}
                      className="flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:opacity-60"
                    >
                      {exportingFeedback ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
                      CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => void exportFeedback("xlsx")}
                      disabled={exportingFeedback}
                      className="flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:opacity-60"
                    >
                      {exportingFeedback ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
                      Excel
                    </button>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-md border border-line bg-mist p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Feedback</p>
                    <p className="mt-1 text-2xl font-semibold text-ink">{(feedbackSummary?.total ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-md border border-line bg-mist p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Good Responses</p>
                    <p className="mt-1 text-2xl font-semibold text-signal">{(feedbackSummary?.good ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-md border border-line bg-mist p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Bad Responses</p>
                    <p className="mt-1 text-2xl font-semibold text-red-600">{(feedbackSummary?.bad ?? 0).toLocaleString()}</p>
                  </div>
                  <div className="rounded-md border border-line bg-mist p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Good Rate</p>
                    <p className="mt-1 text-2xl font-semibold text-ink">{feedbackSummary?.goodRate ?? 0}%</p>
                  </div>
                </div>

                {feedbackLoading ? (
                  <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                    Loading feedback…
                  </div>
                ) : feedbackRecords.length === 0 ? (
                  <div className="rounded-md border border-dashed border-line bg-mist px-4 py-6 text-center text-sm text-slate-500">
                    No feedback recorded yet.
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                            <th className="px-3 py-3 font-semibold">Timestamp</th>
                            <th className="px-3 py-3 font-semibold">Username</th>
                            <th className="px-3 py-3 font-semibold">Rating</th>
                            <th className="px-3 py-3 font-semibold">Question</th>
                            <th className="px-3 py-3 font-semibold">Response Preview</th>
                            <th className="px-3 py-3 font-semibold">AI Provider</th>
                            <th className="px-3 py-3 font-semibold">Sources</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feedbackRecords.map((rec) => (
                            <tr key={rec.id} className="border-b border-line last:border-0">
                              <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                                {formatMalaysiaTimestamp(rec.createdAt)}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 font-medium text-ink">
                                {rec.username}
                              </td>
                              <td className="whitespace-nowrap px-3 py-3">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${rec.rating === "good" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                  {rec.rating === "good" ? "👍 Good" : "👎 Bad"}
                                </span>
                              </td>
                              <td className="max-w-xs px-3 py-3 text-slate-700">
                                <span className="line-clamp-2">{rec.question ?? "-"}</span>
                              </td>
                              <td className="max-w-xs px-3 py-3 text-slate-600">
                                <span className="line-clamp-2 text-xs">{rec.response ? rec.response.slice(0, 120) + (rec.response.length > 120 ? "…" : "") : "-"}</span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                                {rec.aiProvider ?? "-"}
                              </td>
                              <td className="max-w-xs px-3 py-3 text-slate-600">
                                {rec.sources && rec.sources.length > 0
                                  ? <span className="text-xs">{rec.sources.slice(0, 3).join(", ")}{rec.sources.length > 3 ? ` +${rec.sources.length - 3}` : ""}</span>
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-slate-500">
                        {feedbackTotal === 0
                          ? "No records"
                          : `Showing ${(feedbackPage - 1) * 50 + 1}–${Math.min(feedbackPage * 50, feedbackTotal)} of ${feedbackTotal}`}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => void loadFeedback({ targetPage: Math.max(1, feedbackPage - 1), rating: feedbackRatingFilter, username: feedbackUsernameFilter, search: feedbackSearch })}
                          disabled={feedbackPage <= 1 || feedbackLoading}
                          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="text-sm text-slate-600">Page {feedbackPage} of {feedbackTotalPages}</span>
                        <button
                          type="button"
                          onClick={() => void loadFeedback({ targetPage: Math.min(feedbackTotalPages, feedbackPage + 1), rating: feedbackRatingFilter, username: feedbackUsernameFilter, search: feedbackSearch })}
                          disabled={feedbackPage >= feedbackTotalPages || feedbackLoading}
                          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}
          </>
        )}

        {/* ── USERS TAB ─────────────────────────────────────────────────────── */}
        {activeTab === "users" && (
          <>
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
                        <th className="px-3 py-3 font-semibold">Rank</th>
                        <th className="px-3 py-3 font-semibold">Username</th>
                        <th className="px-3 py-3 font-semibold">Full Name</th>
                        <th className="min-w-[180px] px-3 py-3 font-semibold">Progress</th>
                        <th className="px-3 py-3 font-semibold">Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userProgressData.map((u, idx) => (
                        <tr key={u.username} className="border-b border-line last:border-0">
                          <td className="px-3 py-3 text-center text-sm font-semibold text-slate-600">
                            {rankBadge(idx + 1)}
                          </td>
                          <td className="px-3 py-3 font-medium text-ink">{toDisplayName(u.username)}</td>
                          <td className="px-3 py-3 text-slate-700">{u.fullName ?? "-"}</td>
                          <td className="min-w-[180px] px-3 py-4">
                            <ProgressBar
                              percent={progressNumber(u.progressPercent)}
                              completedCount={u.completedTopics?.length ?? 0}
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-600" title={`Last Active: ${formatMalaysiaTimestamp(u.lastActiveAt)}`}>
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
                  <p className="mt-1 text-xs text-slate-500">
                    Only users with saved conversation history appear here. Deleting removes
                    conversation history only — training records remain in Neon.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Export buttons */}
                  <button
                    type="button"
                    onClick={() => exportUserActivity("csv")}
                    className="flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => exportUserActivity("xlsx")}
                    className="flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Excel
                  </button>
                  {/* Search input */}
                  <label className="relative block">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                    <input
                      value={userConvSearch}
                      onChange={(e) => setUserConvSearch(e.target.value)}
                      placeholder="Search user..."
                      className="w-48 rounded-md border border-line bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    Username
                    <select
                      value={userConvFilter}
                      onChange={(e) => setUserConvFilter(e.target.value)}
                      className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                    >
                      <option value="all">All Users</option>
                      {userStats.map((u) => (
                        <option key={u.userId} value={u.userId}>
                          {toDisplayName(u.userId)}
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

              {/* Found count */}
              {(userConvSearch.trim() || userConvFilter !== "all") && (
                <p className="mb-3 text-xs text-slate-500">
                  Showing {filteredUserStats.length} of {userStats.length} users
                </p>
              )}

              {deletedUserInfo ? (
                <div className="mb-3 flex items-start justify-between gap-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm">
                  <div className="text-green-800">
                    <p className="font-semibold">Deleted user history:</p>
                    <p>User: <span className="font-medium">{toDisplayName(deletedUserInfo.userId)}</span></p>
                    <p>Conversations removed: <span className="font-medium">{deletedUserInfo.conversations}</span></p>
                    <p>Messages removed: <span className="font-medium">{deletedUserInfo.messages}</span></p>
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
              ) : filteredUserStats.length === 0 ? (
                <div className="rounded-md border border-dashed border-line bg-mist px-4 py-6 text-center text-sm text-slate-500">
                  {userStats.length === 0 ? "No conversation history found." : "No users match the current filter."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-3 font-semibold">Username</th>
                        <th className="px-3 py-3 font-semibold">Conversations</th>
                        <th className="px-3 py-3 font-semibold">Messages</th>
                        <th className="px-3 py-3 font-semibold">Topics</th>
                        <th className="px-3 py-3 font-semibold">👍 Good</th>
                        <th className="px-3 py-3 font-semibold">👎 Bad</th>
                        <th className="px-3 py-3 font-semibold">Latest Activity</th>
                        <th className="px-3 py-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUserStats.map((user) => (
                        <tr key={user.userId} className="border-b border-line last:border-0">
                          <td className="px-3 py-3 font-medium text-ink">{toDisplayName(user.userId)}</td>
                          <td className="px-3 py-3 text-slate-700">{user.conversationCount}</td>
                          <td className="px-3 py-3 text-slate-700">{user.messageCount}</td>
                          <td className="px-3 py-3 text-slate-700">{user.topicsCompleted ?? 0}</td>
                          <td className="px-3 py-3 text-green-600 font-medium">{user.goodFeedback ?? 0}</td>
                          <td className="px-3 py-3 text-red-500 font-medium">{user.badFeedback ?? 0}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                            {user.latestActivity ? formatMalaysiaTimestamp(user.latestActivity) : "-"}
                          </td>
                          <td className="px-3 py-3">
                            {confirmDeleteUserId === user.userId ? (
                              <div className="flex flex-col gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                                <p className="text-xs text-red-700">
                                  This will permanently delete all conversation history for this user.
                                  Training records in Neon will not be deleted.
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
          </>
        )}

        {/* ── TRAINING TAB ──────────────────────────────────────────────────── */}
        {activeTab === "training" && (
          <>
            {/* Training Overview event counts */}
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

            {/* Topic Analytics */}
            <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-ink">Topic Analytics</h2>
                  <p className="text-sm text-slate-600">
                    Topic selection frequency from training_events.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadTopicAnalytics}
                  disabled={topicAnalyticsLoading}
                  className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {topicAnalyticsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  )}
                  Refresh
                </button>
              </div>
              {topicAnalyticsLoading ? (
                <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                  Loading…
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Most Studied */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Most Studied Topics (Top 10)
                    </p>
                    {topicAnalytics?.topTopics && topicAnalytics.topTopics.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                              <th className="px-3 py-2 text-left font-semibold">#</th>
                              <th className="px-3 py-2 text-left font-semibold">Topic</th>
                              <th className="px-3 py-2 text-right font-semibold">Selections</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topicAnalytics.topTopics.map((t, i) => (
                              <tr key={t.topic} className="border-b border-line last:border-0">
                                <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                                <td className="px-3 py-2 text-slate-700">{t.topic}</td>
                                <td className="px-3 py-2 text-right font-semibold text-signal">
                                  {t.selections.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No topic selection data yet.</p>
                    )}
                  </div>

                  {/* Least Studied */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                      Least Studied Topics (Bottom 10)
                    </p>
                    {topicAnalytics?.bottomTopics && topicAnalytics.bottomTopics.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                              <th className="px-3 py-2 text-left font-semibold">#</th>
                              <th className="px-3 py-2 text-left font-semibold">Topic</th>
                              <th className="px-3 py-2 text-right font-semibold">Selections</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topicAnalytics.bottomTopics.map((t, i) => (
                              <tr key={t.topic} className="border-b border-line last:border-0">
                                <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                                <td className="px-3 py-2 text-slate-700">{t.topic}</td>
                                <td className="px-3 py-2 text-right font-semibold text-slate-500">
                                  {t.selections.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No topic selection data yet.</p>
                    )}
                  </div>
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
                        void loadAnalytics(val);
                        void loadTrainingRecords({ targetPage: 1, limit: recordsPerPage, username: val, event: eventFilter, search });
                      }}
                      className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                    >
                      <option value="all">All</option>
                      {trainingUserStats.map((u) => (
                        <option key={u.username} value={u.username}>{u.username}</option>
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
                        void loadTrainingRecords({ targetPage: 1, limit: recordsPerPage, username: usernameFilter, event: val, search });
                      }}
                      className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                    >
                      <option value="all">All</option>
                      {EVENT_TYPES.map((et) => (
                        <option key={et} value={et}>{et}</option>
                      ))}
                    </select>
                  </label>
                  <label className="relative block sm:w-80">
                    <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" aria-hidden="true" />
                    <input
                      value={search}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSearch(val);
                        void loadTrainingRecords({ targetPage: 1, limit: recordsPerPage, username: usernameFilter, event: eventFilter, search: val });
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
                        void loadTrainingRecords({ targetPage: 1, limit: val, username: usernameFilter, event: eventFilter, search });
                      }}
                      className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => void exportTraining("csv")}
                    disabled={exportingTraining}
                    className="flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:opacity-60"
                  >
                    {exportingTraining ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
                    CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => void exportTraining("xlsx")}
                    disabled={exportingTraining}
                    className="flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:opacity-60"
                  >
                    {exportingTraining ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
                    Excel
                  </button>
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
                              <Loader2 className="mx-auto h-5 w-5 animate-spin text-signal" aria-hidden="true" />
                            </td>
                          </tr>
                        ) : neonRecords.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-3 py-8 text-center text-sm text-slate-500">
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
                                {record.progressPercent != null ? `${Math.round(Number(record.progressPercent))}%` : "-"}
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
                        : `Showing ${(page - 1) * recordsPerPage + 1}–${Math.min(page * recordsPerPage, neonTotal)} of ${neonTotal}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newPage = Math.max(1, page - 1);
                          setPage(newPage);
                          void loadTrainingRecords({ targetPage: newPage, limit: recordsPerPage, username: usernameFilter, event: eventFilter, search });
                        }}
                        disabled={page <= 1 || neonLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span className="text-sm text-slate-600">Page {page} of {neonTotalPages}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newPage = Math.min(neonTotalPages, page + 1);
                          setPage(newPage);
                          void loadTrainingRecords({ targetPage: newPage, limit: recordsPerPage, username: usernameFilter, event: eventFilter, search });
                        }}
                        disabled={page >= neonTotalPages || neonLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* Search Analytics */}
            <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-ink">Most Searched Questions</h2>
                  <p className="text-sm text-slate-600">Top 10 questions asked by learners.</p>
                </div>
                <button
                  type="button"
                  onClick={loadSearchAnalytics}
                  disabled={searchAnalyticsLoading}
                  className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {searchAnalyticsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  )}
                  Refresh
                </button>
              </div>
              {searchAnalyticsLoading ? (
                <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                  Loading…
                </div>
              ) : searchAnalytics?.topQuestions && searchAnalytics.topQuestions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-2 text-left font-semibold">#</th>
                        <th className="px-3 py-2 text-left font-semibold">Question</th>
                        <th className="px-3 py-2 text-right font-semibold">Count</th>
                        <th className="px-3 py-2 text-right font-semibold">Last Asked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchAnalytics.topQuestions.map((q, i) => (
                        <tr key={i} className="border-b border-line last:border-0">
                          <td className="px-3 py-2 text-slate-400">{i + 1}</td>
                          <td className="max-w-md px-3 py-2 text-slate-700">
                            <span className="line-clamp-2">{q.question}</span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-right">
                            <span className="inline-flex items-center rounded-full bg-signal/10 px-2 py-0.5 text-xs font-semibold text-signal">
                              {q.count}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-right text-slate-500">
                            {q.lastAsked ? formatMalaysiaTimestamp(q.lastAsked) : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-md border border-dashed border-line bg-mist px-4 py-6 text-center text-sm text-slate-500">
                  No search data yet.
                </div>
              )}
            </section>

            {/* Training User Management */}
            <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-ink">Training User Management</h2>
                  <p className="text-sm text-slate-600">
                    Delete training records and progress for a specific user.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Deleting removes training_events and user_progress only — conversation history
                    is not affected.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadTrainingUserStats}
                  disabled={trainingUserStatsLoading}
                  className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {trainingUserStatsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  )}
                  Refresh
                </button>
              </div>

              {deletedTrainingUserInfo ? (
                <div className="mb-3 flex items-start justify-between gap-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm">
                  <div className="text-green-800">
                    <p className="font-semibold">Deleted training records:</p>
                    <p>User: <span className="font-medium">{deletedTrainingUserInfo.username}</span></p>
                    <p>Training events removed: <span className="font-medium">{deletedTrainingUserInfo.deletedEvents}</span></p>
                    <p>Progress rows removed: <span className="font-medium">{deletedTrainingUserInfo.deletedProgress}</span></p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeletedTrainingUserInfo(null)}
                    className="shrink-0 rounded p-0.5 text-green-600 hover:bg-green-100"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              ) : null}

              {trainingUserStatsLoading ? (
                <div className="flex items-center gap-3 py-6 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                  Loading training users…
                </div>
              ) : trainingUserStats.length === 0 ? (
                <div className="rounded-md border border-dashed border-line bg-mist px-4 py-6 text-center text-sm text-slate-500">
                  No training users found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line bg-mist text-xs uppercase tracking-wide text-slate-500">
                        <th className="px-3 py-3 font-semibold">Username</th>
                        <th className="px-3 py-3 font-semibold">Training Events</th>
                        <th className="px-3 py-3 font-semibold">Topics Completed</th>
                        <th className="px-3 py-3 font-semibold">Latest Activity</th>
                        <th className="px-3 py-3 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingUserStats.map((u) => (
                        <tr key={u.username} className="border-b border-line last:border-0">
                          <td className="px-3 py-3 font-medium text-ink">{u.username}</td>
                          <td className="px-3 py-3 text-slate-700">{u.trainingEventCount}</td>
                          <td className="px-3 py-3 text-slate-700">{u.completedTopicCount}</td>
                          <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                            {formatMalaysiaTimestamp(u.latestActivity)}
                          </td>
                          <td className="px-3 py-3">
                            {confirmDeleteTrainingUser === u.username ? (
                              <div className="flex flex-col gap-2 rounded-md border border-red-200 bg-red-50 p-3">
                                <p className="text-xs text-red-700">
                                  This will permanently delete all training records and progress for{" "}
                                  <span className="font-semibold">{u.username}</span>. Conversation
                                  history will not be deleted.
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => deleteTrainingUser(u.username)}
                                    disabled={deletingTrainingUser === u.username}
                                    className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                                  >
                                    {deletingTrainingUser === u.username ? (
                                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                    ) : (
                                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                                    )}
                                    Yes, Delete Training Records
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteTrainingUser(null)}
                                    className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteTrainingUser(u.username)}
                                className="flex items-center gap-1.5 rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-400 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" aria-hidden="true" />
                                Delete Training Records
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {/* ── LEARNED ANSWERS TAB ──────────────────────────────────────────── */}
        {activeTab === "learned" && (
          <>
            {/* Summary cards */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Candidates</p>
                <p className="mt-1 text-3xl font-semibold text-amber-500">{learnedSummary?.candidates ?? 0}</p>
                <p className="mt-1 text-xs text-slate-500">Awaiting review</p>
              </div>
              <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Approved</p>
                <p className="mt-1 text-3xl font-semibold text-signal">{learnedSummary?.approved ?? 0}</p>
                <p className="mt-1 text-xs text-slate-500">Active in search</p>
              </div>
              <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Rejected</p>
                <p className="mt-1 text-3xl font-semibold text-slate-400">{learnedSummary?.rejected ?? 0}</p>
                <p className="mt-1 text-xs text-slate-500">Not used in search</p>
              </div>
            </div>

            <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="font-semibold text-ink">Learned Answers</h2>
                  <p className="text-sm text-slate-600">
                    Answers from good feedback · Approve to use before AI · Reject to skip
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    Status
                    <select
                      value={learnedStatusFilter}
                      onChange={(e) => {
                        const val = e.target.value;
                        setLearnedStatusFilter(val);
                        void loadLearnedAnswers({ page: 1, status: val });
                      }}
                      className="rounded-md border border-line bg-white px-2 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                    >
                      <option value="all">All</option>
                      <option value="candidate">Candidate</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={() => void loadLearnedAnswers({ page: learnedPage, status: learnedStatusFilter })}
                    disabled={learnedLoading}
                    className="flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {learnedLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RefreshCw className="h-4 w-4" aria-hidden="true" />}
                    Refresh
                  </button>
                </div>
              </div>

              {learnedLoading ? (
                <div className="flex items-center gap-3 py-4 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                  Loading…
                </div>
              ) : learnedRecords.length === 0 ? (
                <div className="rounded-md border border-dashed border-line bg-mist px-4 py-6 text-center text-sm text-slate-500">
                  No learned answers yet. Good feedback will appear here as candidates.
                </div>
              ) : (
                <div className="space-y-3">
                  {learnedRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className={`rounded-md border p-4 ${
                        rec.status === "approved"
                          ? "border-signal/30 bg-signal/5"
                          : rec.status === "rejected"
                            ? "border-slate-200 bg-slate-50"
                            : "border-amber-200 bg-amber-50/50"
                      }`}
                    >
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                              rec.status === "approved"
                                ? "bg-signal/15 text-signal"
                                : rec.status === "rejected"
                                  ? "bg-slate-200 text-slate-500"
                                  : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {rec.status}
                          </span>
                          {rec.status === "approved" && rec.reusedCount > 0 && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700">
                              <Zap className="h-3 w-3" aria-hidden="true" />
                              Used {rec.reusedCount}×
                            </span>
                          )}
                          {rec.username && (
                            <span className="text-xs text-slate-400">by {rec.username}</span>
                          )}
                          <span className="text-xs text-slate-400">{formatMalaysiaTimestamp(rec.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {rec.status !== "approved" && (
                            <button
                              type="button"
                              onClick={() => void approveLearnedAnswer(rec.id)}
                              disabled={learnedActingId === rec.id}
                              className="flex items-center gap-1 rounded-md border border-signal/30 bg-white px-2.5 py-1.5 text-xs font-medium text-signal transition hover:bg-signal hover:text-white disabled:opacity-50"
                            >
                              {learnedActingId === rec.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                              Approve
                            </button>
                          )}
                          {rec.status !== "rejected" && (
                            <button
                              type="button"
                              onClick={() => void rejectLearnedAnswer(rec.id)}
                              disabled={learnedActingId === rec.id}
                              className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => void deleteLearnedAnswer(rec.id)}
                            disabled={learnedActingId === rec.id}
                            className="flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <p className="mb-2 text-sm font-semibold text-ink">
                        Q: {rec.originalQuestion}
                      </p>

                      {editingLearnedId === rec.id ? (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={editingLearnedResponse}
                            onChange={(e) => setEditingLearnedResponse(e.target.value)}
                            rows={6}
                            className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => void saveLearnedAnswerEdit(rec.id)}
                              disabled={learnedActingId === rec.id}
                              className="flex items-center gap-1.5 rounded-md bg-signal px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
                            >
                              {learnedActingId === rec.id ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingLearnedId(null)}
                              className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="group relative">
                          <p className="whitespace-pre-wrap text-sm text-slate-700">{rec.response}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLearnedId(rec.id);
                              setEditingLearnedResponse(rec.response);
                            }}
                            className="mt-1 text-xs text-slate-400 underline-offset-2 hover:text-signal hover:underline"
                          >
                            Edit response
                          </button>
                        </div>
                      )}

                      {rec.status === "approved" && rec.approvedBy && (
                        <p className="mt-2 text-xs text-slate-400">
                          Approved by {rec.approvedBy}
                          {rec.approvedAt ? ` · ${formatMalaysiaTimestamp(rec.approvedAt)}` : ""}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {learnedTotalPages > 1 && (
                <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                  <span className="text-slate-500">
                    Page {learnedPage} of {learnedTotalPages} · {learnedTotal} total
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void loadLearnedAnswers({ page: learnedPage - 1, status: learnedStatusFilter })}
                      disabled={learnedPage <= 1 || learnedLoading}
                      className="flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => void loadLearnedAnswers({ page: learnedPage + 1, status: learnedStatusFilter })}
                      disabled={learnedPage >= learnedTotalPages || learnedLoading}
                      className="flex items-center gap-1 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryCard({
  title,
  subtitle,
  value,
  icon,
  small = false,
  trend,
}: {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: ReactNode;
  small?: boolean;
  trend?: TrendData;
}) {
  return (
    <article className="group rounded-lg border border-line bg-white p-4 shadow-panel transition hover:border-signal/40 hover:shadow-md">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-slatePanel text-white">
        {icon}
      </div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`mt-1 font-semibold text-ink ${small ? "text-base leading-snug" : "text-2xl"}`}>
        {value}
      </p>
      {trend && (
        <p
          className={`mt-1 text-xs font-medium ${
            trend.direction === "up"
              ? "text-green-600"
              : trend.direction === "down"
              ? "text-red-500"
              : "text-slate-400"
          }`}
        >
          {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"}
          {trend.direction !== "flat"
            ? ` ${trend.direction === "up" ? "+" : "-"}${trend.pct}%`
            : " No change"}{" "}
          vs last 7 days
        </p>
      )}
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </article>
  );
}

function AnalyticCard({
  label,
  value,
  decimal = false,
}: {
  label: string;
  value: number;
  decimal?: boolean;
}) {
  return (
    <div className="rounded-md border border-line bg-mist p-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink">
        {decimal ? value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : value.toLocaleString()}
      </p>
    </div>
  );
}

function ProgressBar({
  percent,
  completedCount,
}: {
  percent: number;
  completedCount: number;
}) {
  const pct = Math.min(100, Math.max(0, percent));
  return (
    <div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-signal transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-xs">
        <span className="text-slate-500">{completedCount} Topics</span>
        <span className="font-medium text-ink">{Math.round(pct)}%</span>
      </div>
    </div>
  );
}

function HealthStatRow({
  emoji,
  label,
  value,
  color,
}: {
  emoji: string;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-line bg-mist px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-lg leading-none">{emoji}</span>
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className={`text-xl font-semibold ${color}`}>{typeof value === "number" ? value.toLocaleString() : value}</span>
    </div>
  );
}
