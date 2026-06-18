"use client";

import { History, Loader2, Lock, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatThread } from "@/components/ChatThread";
import {
  ConversationHistoryDrawer,
  type ConversationSummary,
} from "@/components/ConversationHistoryDrawer";
import { IntakeSidebar } from "@/components/IntakeSidebar";
import { commonQuestions } from "@/lib/commonQuestions";
import { generateTitle } from "@/lib/conversationUtils";
import { lmxKnowledge, type IssueIntake } from "@/lib/lmxKnowledge";
import type { ChatAttachment, ChatMessage, ChatSource, SourceLink, SourceNote } from "@/lib/chatTypes";

const emptyIntake: IssueIntake = {
  clientTenant: "",
  network: "",
  location: "",
  deviceName: "",
  deviceOs: "",
  issueCategory: "",
  contentCampaign: "",
  startTime: "",
  mediaLink: "",
  description: ""
};

export default function Home() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [hasAiProvider, setHasAiProvider] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [intake, setIntake] = useState<IssueIntake>(emptyIntake);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [selectedCommonQuestion, setSelectedCommonQuestion] = useState("");
  const [feedbackState, setFeedbackState] = useState<Record<string, "good" | "bad" | "pending" | "error">>({});
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const askAssistantSectionRef = useRef<HTMLElement>(null);
  const askAssistantInputRef = useRef<HTMLTextAreaElement>(null);

  // Conversation history state
  const [historyOpen, setHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [historyAvailable, setHistoryAvailable] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth")
      .then((response) => response.json())
      .then((data: { authenticated: boolean; username?: string; displayName?: string; hasAiProvider?: boolean }) => {
        setAuthenticated(data.authenticated);
        setUsername(data.username ?? "");
        setDisplayName(data.displayName ?? data.username ?? "");
        setHasAiProvider(data.hasAiProvider ?? false);
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  // Probe history availability once authenticated. 503 means DATABASE_URL is not set.
  useEffect(() => {
    if (!authenticated) return;
    fetch("/api/conversations")
      .then(async (res) => {
        if (res.status === 503) {
          setHistoryAvailable(false);
          return;
        }
        if (res.ok) {
          const data = (await res.json()) as ConversationSummary[];
          setConversations(data);
          setHistoryAvailable(true);
        }
      })
      .catch(() => setHistoryAvailable(false));
  }, [authenticated]);

  const selectedTopic = useMemo(
    () => lmxKnowledge.find((entry) => entry.category === intake.issueCategory),
    [intake.issueCategory]
  );

  async function fileToDataUrl(file: File) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";

    for (let index = 0; index < bytes.length; index += 1) {
      binary += String.fromCharCode(bytes[index]);
    }

    return `data:${file.type || "application/octet-stream"};base64,${btoa(binary)}`;
  }

  async function handleAttachmentChange(files: FileList | null) {
    if (!files) {
      return;
    }

    const nextFiles = Array.from(files).slice(0, Math.max(0, 3 - attachments.length));
    const supportedFiles = nextFiles.filter((file) => file.size <= 8 * 1024 * 1024);
    const prepared = await Promise.all(
      supportedFiles.map(async (file) => {
        const isTextLike =
          file.type.startsWith("text/") ||
          file.type.includes("csv") ||
          file.type.includes("json") ||
          /\.(csv|txt|md|json)$/i.test(file.name);

        return {
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
          text: isTextLike ? await file.text() : undefined,
          dataUrl: isTextLike ? undefined : await fileToDataUrl(file)
        };
      })
    );

    setAttachments((current) => [...current, ...prepared].slice(0, 3));

    if (attachmentInputRef.current) {
      attachmentInputRef.current.value = "";
    }
  }

  function removeAttachment(name: string) {
    setAttachments((current) => current.filter((attachment) => attachment.name !== name));
  }

  async function handleLogin(event: { preventDefault(): void }) {
    event.preventDefault();
    setAuthError("");

    const cleanEmail = loginEmail.trim().toLowerCase();

    if (!cleanEmail) {
      setAuthError("Email is required.");
      return;
    }
    if (!cleanEmail.endsWith("@movingwalls.com")) {
      setAuthError("Only @movingwalls.com email addresses are allowed.");
      return;
    }

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setAuthError(data.error ?? "Unable to sign in.");
      return;
    }

    const data = (await response.json()) as { username?: string; displayName?: string };
    setAuthenticated(true);
    setUsername(data.username ?? cleanEmail.split("@")[0]);
    setDisplayName(data.displayName ?? data.username ?? "");
    setLoginEmail("");
    setPassword("");
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
    setUsername("");
    setDisplayName("");
    setIntake(emptyIntake);
    setMessages([]);
    setConversations([]);
    setActiveConversationId(null);
    setHistoryAvailable(false);
    setHistoryOpen(false);
  }

  // Scrolls the Ask Assistant card into view and focuses its textarea.
  // Called after any "New Topic" action so the user can immediately type.
  function focusAskAssistant() {
    requestAnimationFrame(() => {
      askAssistantSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      askAssistantInputRef.current?.focus({ preventScroll: true });
    });
  }

  async function handleFeedback(messageId: string, rating: "good" | "bad") {
    const msgIndex = messages.findIndex((m) => m.id === messageId);
    if (msgIndex < 0) return;
    const assistantMsg = messages[msgIndex];
    const questionMsg = messages.slice(0, msgIndex).reverse().find((m) => m.role === "user");

    setFeedbackState((prev) => ({ ...prev, [messageId]: "pending" }));
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConversationId,
          messageId: assistantMsg.dbId,
          question: questionMsg?.content ?? "",
          response: assistantMsg.content,
          rating,
          aiProvider: assistantMsg.source,
          sources: [
            ...(assistantMsg.sourceLinks?.map((l) => l.label) ?? []),
            ...(assistantMsg.sourceNotes?.map((n) => n.file.replace(/\.md$/i, "")) ?? []),
          ].filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Feedback failed");
      setFeedbackState((prev) => ({ ...prev, [messageId]: rating }));
    } catch {
      setFeedbackState((prev) => ({ ...prev, [messageId]: "error" }));
    }
  }

  // --- Conversation history actions ---

  async function fetchConversations() {
    if (!historyAvailable) return;
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = (await res.json()) as ConversationSummary[];
        setConversations(data);
      }
    } catch {
      // silently ignore — drawer shows stale list
    } finally {
      setHistoryLoading(false);
    }
  }

  async function openConversation(id: string) {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        id: string;
        messages: Array<{ id: string; role: string; content: string }>;
      };
      const loaded: ChatMessage[] = data.messages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
        source: m.role === "assistant" ? ("knowledge" as ChatSource) : undefined,
        dbId: m.role === "assistant" ? m.id : undefined,
      }));
      setMessages(loaded);
      setFeedbackState({});
      setActiveConversationId(id);
    } catch {
      // silently ignore
    }
  }

  async function createNewConversation() {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" })
      });
      if (!res.ok) return;
      const newConv = (await res.json()) as ConversationSummary;
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      setMessages([]);
      setFeedbackState({});
      setHistoryOpen(false);
    } catch {
      // silently ignore
    }
    focusAskAssistant();
  }

  async function deleteConversation(id: string) {
    try {
      const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (!res.ok) return;
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) {
        setActiveConversationId(null);
        setMessages([]);
      }
    } catch {
      // silently ignore
    }
  }

  async function renameConversation(id: string, newTitle: string) {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle })
      });
      if (!res.ok) return;
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
      );
    } catch {
      // silently ignore
    }
  }

  // --- Mobile "New Topic" shortcut ---
  // Creates a fresh conversation (or clears locally if DB unavailable).
  // Never sends a message — only resets the thread.
  async function handleNewTopicButton() {
    let convId: string | null = null;

    if (historyAvailable) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New Conversation" }),
        });
        if (res.ok) {
          const newConv = (await res.json()) as ConversationSummary;
          setConversations((prev) => [newConv, ...prev]);
          convId = newConv.id;
        }
      } catch {
        // Silently ignore — still clear the thread.
      }
    }

    setActiveConversationId(convId);
    setMessages([]);
    setFeedbackState({});
    setSelectedCommonQuestion("");
    focusAskAssistant();
  }

  // --- Chat ---

  // Ask Assistant — always starts a fresh conversation, never continues the current one.
  // All state values are captured at the top before any await to avoid stale closure issues.
  async function sendNewTopicMessage() {
    const messageText = input.trim();
    if ((!messageText && attachments.length === 0) || loading) return;

    const questionIntake: IssueIntake = {
      ...intake,
      issueCategory: intake.issueCategory || "",
      description: messageText,
    };
    const submittedAttachments = [...attachments];
    const userContent = [
      messageText || "Please review the attached file.",
      ...submittedAttachments.map((a) => `Attached: ${a.name}`),
    ].join("\n");

    // Create a DB conversation before touching any UI state.
    let convId: string | null = null;
    if (historyAvailable) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "New Conversation" }),
        });
        if (res.ok) {
          const newConv = (await res.json()) as ConversationSummary;
          setConversations((prev) => [newConv, ...prev]);
          convId = newConv.id;
        }
      } catch {
        // No DB save this round — message still sends.
      }
    }

    // Reset UI to a clean thread with only the new user message.
    setSelectedCommonQuestion("");
    setIntake(questionIntake);
    setActiveConversationId(convId);
    setMessages([{ id: crypto.randomUUID(), role: "user" as const, content: userContent }]);
    setInput("");
    setAttachments([]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          attachments: submittedAttachments,
          intake: questionIntake,
          history: [],
          conversationId: convId ?? undefined,
        }),
      });
      if (!res.ok) throw new Error("Chat request failed.");
      const data = (await res.json()) as {
        reply: string;
        source: ChatSource;
        sourceLinks?: SourceLink[];
        sourceNotes?: SourceNote[];
        assistantMessageId?: string;
      };
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content: data.reply,
          source: data.source,
          sourceLinks: data.sourceLinks ?? [],
          sourceNotes: data.sourceNotes ?? [],
          dbId: data.assistantMessageId,
        },
      ]);
      if (convId) {
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, updatedAt: new Date().toISOString() } : c))
        );
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          source: "local" as ChatSource,
          content: "Please refresh the page and ask the training question again. If it still fails, check the app server logs.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Bottom reply bar — continues the currently active conversation.
  // All state values are captured at the top before any await to avoid stale closure issues.
  async function sendFollowUpMessage() {
    const messageText = input.trim();
    if ((!messageText && attachments.length === 0) || loading) return;

    const questionIntake: IssueIntake = {
      ...intake,
      issueCategory: intake.issueCategory || "",
      description: messageText,
    };
    const historyToSend = messages.map((m) => ({ role: m.role, content: m.content }));
    const submittedAttachments = [...attachments];
    const convId = activeConversationId;
    const userContent = [
      messageText || "Please review the attached file.",
      ...submittedAttachments.map((a) => `Attached: ${a.name}`),
    ].join("\n");

    setSelectedCommonQuestion("");
    setIntake(questionIntake);
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user" as const, content: userContent },
    ]);
    setInput("");
    setAttachments([]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          attachments: submittedAttachments,
          intake: questionIntake,
          history: historyToSend,
          conversationId: convId ?? undefined,
        }),
      });
      if (!res.ok) throw new Error("Chat request failed.");
      const data = (await res.json()) as {
        reply: string;
        source: ChatSource;
        sourceLinks?: SourceLink[];
        sourceNotes?: SourceNote[];
        assistantMessageId?: string;
      };
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          content: data.reply,
          source: data.source,
          sourceLinks: data.sourceLinks ?? [],
          sourceNotes: data.sourceNotes ?? [],
          dbId: data.assistantMessageId,
        },
      ]);
      if (convId) {
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, updatedAt: new Date().toISOString() } : c))
        );
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant" as const,
          source: "local" as ChatSource,
          content: "Please refresh the page and ask the training question again. If it still fails, check the app server logs.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function updateIntake<K extends keyof IssueIntake>(field: K, value: IssueIntake[K]) {
    setMessages([]);
    setFeedbackState({});
    setActiveConversationId(null);
    setSelectedCommonQuestion("");
    setIntake((current) => ({
      ...current,
      [field]: value,
      description: field === "issueCategory" ? "" : current.description
    }));
  }

  async function selectCommonQuestion(question: string) {
    setSelectedCommonQuestion(question);
    setActiveConversationId(null);

    const selected = commonQuestions.find((item) => item.question === question);
    if (!selected) {
      return;
    }

    setIntake((current) => ({ ...current, issueCategory: "", description: selected.question }));
    setMessages([
      { id: crypto.randomUUID(), role: "user", content: selected.question },
      { id: crypto.randomUUID(), role: "assistant", content: selected.answer, source: "local", sourceLinks: selected.sourceLinks ?? [] }
    ]);

    // Progress logging — non-blocking
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "quick_answer_selected",
        username,
        fullName: displayName || username,
        question: selected.question
      })
    }).catch(() => undefined);

    // Persist as a new conversation if history is available.
    // Always creates a fresh conversation — never attaches to the current active one.
    if (historyAvailable) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: generateTitle(selected.question),
            messages: [
              { role: "user", content: selected.question },
              { role: "assistant", content: selected.answer },
            ],
          })
        });
        if (res.ok) {
          const newConv = (await res.json()) as ConversationSummary;
          setConversations((prev) => [newConv, ...prev]);
          setActiveConversationId(newConv.id);
        }
      } catch {
        // Silently ignore — FAQ answer already displayed regardless.
      }
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
              <h1 className="text-xl font-semibold text-ink">LMX Content Support & Training Assistant</h1>
              <p className="text-sm text-slate-600">Internal training access</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Moving Walls Email</span>
              <input
                type="email"
                value={loginEmail}
                onChange={(event) => setLoginEmail(event.target.value)}
                placeholder="yourname@movingwalls.com"
                className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                autoFocus
                autoComplete="email"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Use your Moving Walls email address. Only @movingwalls.com accounts are allowed.
              </p>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              />
            </label>
            {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-signal px-4 py-2.5 font-semibold text-white transition hover:bg-teal-800"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Enter training assistant
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {historyAvailable && (
        <ConversationHistoryDrawer
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          loading={historyLoading}
          onOpen={openConversation}
          onNewTopic={createNewConversation}
          onRename={renameConversation}
          onDelete={deleteConversation}
        />
      )}

      <header className="border-b border-line bg-white/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal">LMX Content CMS</p>
            <h1 className="text-2xl font-semibold text-ink">Support & Training Assistant</h1>
            <p className="mt-1 text-xs text-slate-500">Signed in as {displayName || username}</p>
          </div>
          <div className="flex items-center gap-2">
            {historyAvailable && (
              <button
                type="button"
                onClick={() => {
                  setHistoryOpen(true);
                  void fetchConversations();
                }}
                className="flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
              >
                <History className="h-4 w-4" aria-hidden="true" />
                History
              </button>
            )}
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

      {hasAiProvider ? (
        <input
          ref={attachmentInputRef}
          type="file"
          multiple
          accept=".csv,.txt,.md,.json,.pdf,.doc,.docx,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          onChange={(event) => handleAttachmentChange(event.target.files)}
          className="hidden"
        />
      ) : null}

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[380px_1fr]">
        <IntakeSidebar
          username={username}
          intake={intake}
          onIntakeChange={updateIntake}
          loading={loading}
          input={input}
          onInputChange={setInput}
          onSend={sendNewTopicMessage}
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
          onAttachClick={() => attachmentInputRef.current?.click()}
          hasAiProvider={hasAiProvider}
          selectedCommonQuestion={selectedCommonQuestion}
          onSelectCommonQuestion={selectCommonQuestion}
          onClearMessages={() => {
            setMessages([]);
            setFeedbackState({});
            setActiveConversationId(null);
            setSelectedCommonQuestion("");
          }}
          selectedTopic={selectedTopic}
          askAssistantSectionRef={askAssistantSectionRef}
          askAssistantInputRef={askAssistantInputRef}
        />
        <ChatThread
          messages={messages}
          loading={loading}
          input={input}
          onInputChange={setInput}
          onSend={sendFollowUpMessage}
          onNewTopic={handleNewTopicButton}
          onOpenHistory={historyAvailable ? () => { setHistoryOpen(true); void fetchConversations(); } : undefined}
          attachments={attachments}
          onRemoveAttachment={removeAttachment}
          onAttachClick={() => attachmentInputRef.current?.click()}
          hasAiProvider={hasAiProvider}
          selectedTopic={selectedTopic}
          onFeedback={handleFeedback}
          feedbackState={feedbackState}
        />
      </div>
    </main>
  );
}
