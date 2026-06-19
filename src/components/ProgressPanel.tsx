"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IssueCategory } from "@/lib/lmxKnowledge";

type ProgressPanelProps = {
  username: string;
  fullName?: string;
  selectedTopic?: IssueCategory | "";
  topicCount: number;
};

function storageKey(username: string) {
  return `lmx-training-progress:${username || "anonymous"}`;
}

async function recordProgress(payload: {
  eventType: "topic_selected" | "topic_completed";
  username: string;
  fullName?: string;
  topic?: string;
  progressPercent?: number;
  completedTopics?: string[];
}) {
  try {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch {
    // Progress still stays in local storage if Google logging is unavailable.
  }
}

export function ProgressPanel({ username, fullName, selectedTopic, topicCount }: ProgressPanelProps) {
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const lastSelectedTopic = useRef("");

  useEffect(() => {
    if (!username) return;

    // 1. Immediately init from localStorage for a snappy UI
    let localTopics: string[] = [];
    try {
      const saved = window.localStorage.getItem(storageKey(username));
      localTopics = saved ? (JSON.parse(saved) as string[]) : [];
      setCompletedTopics(localTopics);
    } catch {
      setCompletedTopics([]);
    }

    // 2. Hydrate from Neon — Neon is the source of truth
    let cancelled = false;
    fetch("/api/user/progress")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { completedTopics?: string[] } | null) => {
        if (cancelled || !data || !Array.isArray(data.completedTopics)) return;
        const neonTopics = data.completedTopics as string[];
        // Neon wins when it has at least as many completed topics as localStorage
        if (neonTopics.length >= localTopics.length) {
          setCompletedTopics(neonTopics);
          try {
            window.localStorage.setItem(storageKey(username), JSON.stringify(neonTopics));
          } catch {
            // ignore storage errors
          }
        }
      })
      .catch(() => {
        // Stay on localStorage when Neon is unavailable
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const progressPercent = useMemo(() => {
    if (topicCount === 0) {
      return 0;
    }

    return Math.round((completedTopics.length / topicCount) * 100);
  }, [completedTopics.length, topicCount]);

  useEffect(() => {
    if (!selectedTopic || selectedTopic === "Other" || selectedTopic === lastSelectedTopic.current) {
      return;
    }

    lastSelectedTopic.current = selectedTopic;
    recordProgress({
      eventType: "topic_selected",
      username,
      fullName,
      topic: selectedTopic,
      progressPercent,
      completedTopics
    });
  }, [completedTopics, fullName, progressPercent, selectedTopic, username]);

  function completeTopic() {
    if (!selectedTopic || selectedTopic === "Other" || completedTopics.includes(selectedTopic)) {
      return;
    }

    const nextCompletedTopics = [...completedTopics, selectedTopic];
    const nextProgressPercent = Math.round((nextCompletedTopics.length / topicCount) * 100);

    setCompletedTopics(nextCompletedTopics);
    window.localStorage.setItem(storageKey(username), JSON.stringify(nextCompletedTopics));
    recordProgress({
      eventType: "topic_completed",
      username,
      fullName,
      topic: selectedTopic,
      progressPercent: nextProgressPercent,
      completedTopics: nextCompletedTopics
    });
  }

  const canComplete = Boolean(selectedTopic && selectedTopic !== "Other" && !completedTopics.includes(selectedTopic));

  return (
    <div className="rounded-md border border-line bg-white p-3 text-sm text-slate-700">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">Training Progress</h3>
          <p className="text-xs text-slate-500">Saved locally and to admin records when configured</p>
        </div>
        <span className="rounded-md bg-mist px-2 py-1 text-xs font-semibold text-slate-700">{progressPercent}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-mist">
        <div className="h-full rounded-full bg-signal transition-all" style={{ width: `${progressPercent}%` }} />
      </div>

      <p className="mt-2 text-xs text-slate-600">
        {completedTopics.length} / {topicCount} topics completed
      </p>

      <button
        type="button"
        onClick={completeTopic}
        disabled={!canComplete}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:bg-mist disabled:text-slate-400"
      >
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        {selectedTopic && completedTopics.includes(selectedTopic) ? "Topic completed" : "Mark Topic Complete"}
      </button>
    </div>
  );
}
