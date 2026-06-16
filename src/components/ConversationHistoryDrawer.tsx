"use client";

import { Check, MessageSquare, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

export type ConversationSummary = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  conversations: ConversationSummary[];
  activeConversationId: string | null;
  loading: boolean;
  onOpen: (id: string) => void;
  onNewTopic: () => void;
  onRename: (id: string, newTitle: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

function formatConvTime(updatedAt: string): string {
  const d = new Date(updatedAt);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isToday = new Date(d.getFullYear(), d.getMonth(), d.getDate()) >= todayStart;
  if (isToday) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function groupByDate(items: ConversationSummary[]): Array<{ label: string; items: ConversationSummary[] }> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86_400_000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 86_400_000);

  const buckets: Record<string, ConversationSummary[]> = {
    Today: [],
    Yesterday: [],
    "Last 7 Days": [],
    Older: [],
  };

  for (const item of items) {
    const d = new Date(item.updatedAt);
    const ds = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (ds >= today) buckets.Today.push(item);
    else if (ds >= yesterday) buckets.Yesterday.push(item);
    else if (ds >= sevenDaysAgo) buckets["Last 7 Days"].push(item);
    else buckets.Older.push(item);
  }

  return [
    { label: "Today", items: buckets.Today },
    { label: "Yesterday", items: buckets.Yesterday },
    { label: "Last 7 Days", items: buckets["Last 7 Days"] },
    { label: "Older", items: buckets.Older },
  ].filter((g) => g.items.length > 0);
}

type ItemProps = {
  conv: ConversationSummary;
  active: boolean;
  onOpen: () => void;
  onRename: (newTitle: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

function ConversationItem({ conv, active, onOpen, onRename, onDelete }: ItemProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(conv.title);
  const [busy, setBusy] = useState(false);

  async function commitRename() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== conv.title) {
      setBusy(true);
      await onRename(trimmed);
      setBusy(false);
    }
    setEditing(false);
  }

  async function handleDelete() {
    setBusy(true);
    await onDelete();
  }

  return (
    <div
      className={`group flex items-start gap-2 rounded-md px-2 py-2 transition ${
        active ? "bg-signal/10" : "hover:bg-slate-50"
      }`}
    >
      <MessageSquare
        className={`mt-0.5 h-4 w-4 shrink-0 ${active ? "text-signal" : "text-slate-400"}`}
      />

      {editing ? (
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void commitRename();
              if (e.key === "Escape") setEditing(false);
            }}
            className="min-w-0 flex-1 rounded border border-line px-1.5 py-0.5 text-sm text-ink outline-none focus:border-signal focus:ring-1 focus:ring-signal/20"
          />
          <button
            onClick={() => void commitRename()}
            disabled={busy}
            className="shrink-0 rounded p-0.5 text-signal hover:bg-signal/10 disabled:opacity-50"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setEditing(false)}
            className="shrink-0 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <>
          <button className="min-w-0 flex-1 text-left" onClick={onOpen}>
            <span
              className={`block truncate text-sm leading-snug ${
                active ? "font-medium text-signal" : "text-ink"
              }`}
            >
              {conv.title}
            </span>
            <span className="block text-xs text-slate-400">{formatConvTime(conv.updatedAt)}</span>
          </button>
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              title="Rename"
              onClick={() => {
                setEditValue(conv.title);
                setEditing(true);
              }}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-ink"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              title="Delete"
              onClick={() => void handleDelete()}
              disabled={busy}
              className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function ConversationHistoryDrawer({
  open,
  onClose,
  conversations,
  activeConversationId,
  loading,
  onOpen,
  onNewTopic,
  onRename,
  onDelete,
}: DrawerProps) {
  const groups = groupByDate(conversations);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/25 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <aside
        aria-label="Conversation history"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-xl transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="text-sm font-semibold text-ink">Conversation History</h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-ink"
            aria-label="Close history"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* New Topic */}
        <div className="border-b border-line px-3 py-2.5">
          <button
            onClick={onNewTopic}
            className="flex w-full items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-signal hover:bg-signal/5 hover:text-signal"
          >
            <Plus className="h-4 w-4" />
            New Topic
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {loading ? (
            <p className="px-2 py-6 text-center text-xs text-slate-400">Loading conversations…</p>
          ) : conversations.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-slate-400">No conversations saved yet.</p>
          ) : (
            groups.map(({ label, items }) => (
              <div key={label} className="mb-4">
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {label}
                </p>
                {items.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    active={conv.id === activeConversationId}
                    onOpen={() => {
                      onOpen(conv.id);
                      onClose();
                    }}
                    onRename={(newTitle) => onRename(conv.id, newTitle)}
                    onDelete={() => onDelete(conv.id)}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
