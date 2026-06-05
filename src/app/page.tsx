"use client";

import {
  Clipboard,
  Loader2,
  Lock,
  LogOut,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  X
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AppInstallationTrainingPage } from "@/components/AppInstallationTrainingPage";
import { BundleSchedulingTrainingPage } from "@/components/BundleSchedulingTrainingPage";
import { DefaultPlaylistTrainingPage } from "@/components/DefaultPlaylistTrainingPage";
import { DevicePairingTrainingPage } from "@/components/DevicePairingTrainingPage";
import { DeviceTrainingPage } from "@/components/DeviceTrainingPage";
import { PlaylogTrainingPage } from "@/components/PlaylogTrainingPage";
import { ProgressPanel } from "@/components/ProgressPanel";
import { PublishContentTrainingPage } from "@/components/PublishContentTrainingPage";
import { ScheduleContentTrainingPage } from "@/components/ScheduleContentTrainingPage";
import { StorageManagementTrainingPage } from "@/components/StorageManagementTrainingPage";
import { SupportedHardwareTrainingPage } from "@/components/SupportedHardwareTrainingPage";
import { UserManagementTrainingPage } from "@/components/UserManagementTrainingPage";
import { DashboardTrainingPage, LayoutTrainingPage, LocationTrainingPage, NetworkTrainingPage, PlaylistTrainingPage } from "@/components/TrainingTopicPages";
import { commonQuestions } from "@/lib/commonQuestions";
import { issueCategories, lmxKnowledge, type IssueIntake } from "@/lib/lmxKnowledge";

type ChatSource = "openai" | "knowledge" | "local" | "claude";

type SourceLink = { label: string; url: string };

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: ChatSource;
  sourceLinks?: SourceLink[];
};

type ChatAttachment = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
  text?: string;
};

type KnowledgeTopic = (typeof lmxKnowledge)[number];

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

const trackableTopicCount = issueCategories.filter((category) => category !== "Other").length;

export default function Home() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [intake, setIntake] = useState<IssueIntake>(emptyIntake);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [selectedCommonQuestion, setSelectedCommonQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((response) => response.json())
      .then((data: { authenticated: boolean; username?: string }) => {
        setAuthenticated(data.authenticated);
        setUsername(data.username ?? "");
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const learnerCompleteness = useMemo(() => {
    const required: Array<keyof IssueIntake> = ["clientTenant", "issueCategory"];
    const completed = required.filter((field) => Boolean(intake[field])).length;
    return Math.round((completed / required.length) * 100);
  }, [intake]);

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

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");

    const cleanUsername = loginUsername.trim();

    if (!cleanUsername) {
      setAuthError("Username is required.");
      return;
    }

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: cleanUsername, password })
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setAuthError(data.error ?? "Unable to sign in.");
      return;
    }

    setAuthenticated(true);
    setUsername(cleanUsername);
    setLoginUsername("");
    setPassword("");
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
    setUsername("");
    setIntake(emptyIntake);
    setMessages([]);
  }

  async function sendMessage(text = input) {
    const messageText = text.trim();

    if ((!messageText && attachments.length === 0) || loading) {
      return;
    }

    const questionIntake: IssueIntake = {
      ...intake,
      issueCategory: intake.issueCategory || "",
      description: messageText
    };

    setSelectedCommonQuestion("");
    setIntake(questionIntake);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "user",
        content: [messageText || "Please review the attached file.", ...attachments.map((attachment) => `Attached: ${attachment.name}`)].join("\n")
      }
    ]);
    setInput("");
    const submittedAttachments = attachments;
    setAttachments([]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          attachments: submittedAttachments,
          intake: questionIntake,
          history: []
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed.");
      }

      const data = (await response.json()) as { reply: string; source: ChatSource; sourceLinks?: SourceLink[] };
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: data.reply, source: data.source, sourceLinks: data.sourceLinks ?? [] }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          source: "local",
          content: "Please refresh the page and ask the training question again. If it still fails, check the app server logs."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function updateIntake<K extends keyof IssueIntake>(field: K, value: IssueIntake[K]) {
    setMessages([]);
    setSelectedCommonQuestion("");
    setIntake((current) => ({ ...current, [field]: value, description: field === "issueCategory" ? "" : current.description }));
  }

  async function selectCommonQuestion(question: string) {
    setSelectedCommonQuestion(question);

    const selected = commonQuestions.find((item) => item.question === question);
    if (!selected) {
      return;
    }

    setIntake((current) => ({ ...current, issueCategory: "", description: selected.question }));
    setMessages([
      { id: crypto.randomUUID(), role: "user", content: selected.question },
      { id: crypto.randomUUID(), role: "assistant", content: selected.answer, source: "local" }
    ]);

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "quick_answer_selected",
          username,
          fullName: intake.clientTenant,
          question: selected.question
        })
      });
    } catch {
      // The quick answer still works if progress logging is not configured.
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
              <h1 className="text-xl font-semibold text-ink">LMX Content Training Assistant</h1>
              <p className="text-sm text-slate-600">Internal training access</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                value={loginUsername}
                onChange={(event) => setLoginUsername(event.target.value)}
                className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                autoFocus
              />
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
      <header className="border-b border-line bg-white/90 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-signal">LMX Content CMS</p>
            <h1 className="text-2xl font-semibold text-ink">Training Assistant</h1>
            <p className="mt-1 text-xs text-slate-500">Signed in as {username}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-ink">Learner</h2>
                <p className="text-sm text-slate-600">Used for training personalization</p>
              </div>
              <div className="min-w-14 rounded-md bg-mist px-2 py-1 text-center text-sm font-semibold text-slate-700">
                {learnerCompleteness}%
              </div>
            </div>

            <div className="grid gap-3">
              <Input label="Full Name" value={intake.clientTenant} onChange={(value) => updateIntake("clientTenant", value)} placeholder="Person taking this training" />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Training Topic</span>
                <select
                  value={intake.issueCategory}
                  onChange={(event) => updateIntake("issueCategory", event.target.value as IssueIntake["issueCategory"])}
                  className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                >
                  <option value="">Select topic</option>
                  {issueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              {selectedTopic ? <TopicDetail topic={selectedTopic} /> : null}
              <ProgressPanel
                username={username}
                fullName={intake.clientTenant}
                selectedTopic={intake.issueCategory}
                topicCount={trackableTopicCount}
              />
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-semibold text-ink">Ask Assistant</h2>
              <button
                type="button"
                onClick={() => {
                  setMessages([]);
                  setSelectedCommonQuestion("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal"
                title="Clear answer"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="grid gap-3"
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={4}
                className="min-h-28 resize-none rounded-md border border-line px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                placeholder="Ask any LMX Content question. The assistant will search all training topics."
              />
              {attachments.length > 0 ? (
                <div className="grid gap-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.name} className="flex items-center justify-between gap-2 rounded-md border border-line bg-mist px-3 py-2 text-xs text-slate-600">
                      <span className="truncate">{attachment.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.name)}
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-line bg-white text-slate-500 hover:border-signal hover:text-signal"
                        title="Remove attachment"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
              <input
                ref={attachmentInputRef}
                type="file"
                multiple
                accept=".csv,.txt,.md,.json,.pdf,.doc,.docx,image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                onChange={(event) => handleAttachmentChange(event.target.files)}
                className="hidden"
              />
              <button
                type="submit"
                disabled={loading || (!input.trim() && attachments.length === 0)}
                className="flex min-h-11 items-center justify-center gap-2 rounded-md bg-signal px-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                Send
              </button>
              <button
                type="button"
                onClick={() => attachmentInputRef.current?.click()}
                className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-signal hover:text-signal"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Attach file
              </button>
            </form>
          </section>

          <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <h2 className="mb-3 font-semibold text-ink">Common Questions & Quick Answers</h2>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Question</span>
              <select
                value={selectedCommonQuestion}
                onChange={(event) => selectCommonQuestion(event.target.value)}
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              >
                <option value="">Select a common question</option>
                {commonQuestions.map((item, index) => (
                  <option key={item.question} value={item.question}>
                    {index + 1}. {item.question}
                  </option>
                ))}
              </select>
            </label>
          </section>
        </aside>

        <section className="min-h-[760px] rounded-lg border border-line bg-mist/50 p-4 shadow-panel">
          {messages.length > 0 ? (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={message.role === "user" ? "w-full rounded-lg bg-slatePanel p-4 text-white" : "w-full rounded-lg border border-line bg-white p-4 text-ink"}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{message.role === "user" ? "Question" : "Answer"}</p>
                      {message.role === "assistant" && message.source ? (
                        <span className="rounded-full bg-signal/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-signal">
                          {message.source === "openai" ? "OpenAI" : message.source === "knowledge" ? "Knowledge" : "Local"}
                        </span>
                      ) : null}
                    </div>
                    {message.role === "assistant" ? (
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(message.content)}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal"
                        title="Copy response"
                      >
                        <Clipboard className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>
                  {message.role === "assistant" ? (
                    <>
                      <FormattedResponse content={message.content} />
                      {message.sourceLinks && message.sourceLinks.length > 0 ? (
                        <div className="mt-4 border-t border-line pt-3">
                          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Further reading</p>
                          <div className="flex flex-wrap gap-2">
                            {message.sourceLinks.map((link) => (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded border border-signal/30 bg-signal/5 px-2.5 py-1 text-xs font-medium text-signal transition hover:border-signal hover:bg-signal/10"
                              >
                                {link.label} ↗
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>}
                </article>
              ))}

              {loading ? (
                <div className="flex w-full items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                  Searching all training topics...
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <TopicContent selectedTopic={selectedTopic} />
          )}
        </section>
      </div>
    </main>
  );
}

function TopicContent({ selectedTopic }: { selectedTopic?: KnowledgeTopic }) {
  if (!selectedTopic) return <TrainingOverview />;
  if (selectedTopic.category === "Dashboard Overview") return <DashboardTrainingPage />;
  if (selectedTopic.category === "Create Network") return <NetworkTrainingPage />;
  if (selectedTopic.category === "Create Location") return <LocationTrainingPage />;
  if (selectedTopic.category === "Create Playlist") return <PlaylistTrainingPage />;
  if (selectedTopic.category === "Create Layout") return <LayoutTrainingPage />;
  if (selectedTopic.category === "Create Device") return <DeviceTrainingPage />;
  if (selectedTopic.category === "Device Pairing") return <DevicePairingTrainingPage />;
  if (selectedTopic.category === "Storage Management") return <StorageManagementTrainingPage />;
  if (selectedTopic.category === "Default Playlist") return <DefaultPlaylistTrainingPage />;
  if (selectedTopic.category === "Schedule Content") return <ScheduleContentTrainingPage />;
  if (selectedTopic.category === "Bundle Scheduling") return <BundleSchedulingTrainingPage />;
  if (selectedTopic.category === "Publish Content") return <PublishContentTrainingPage />;
  if (selectedTopic.category === "Playlogs") return <PlaylogTrainingPage />;
  if (selectedTopic.category === "User Management") return <UserManagementTrainingPage />;
  if (selectedTopic.category === "Installation of LMX Content App") return <AppInstallationTrainingPage />;
  if (selectedTopic.category === "Supported Operating Systems & Hardware") return <SupportedHardwareTrainingPage />;
  return <GenericTopicTrainingPage topic={selectedTopic} />;
}

function GenericTopicTrainingPage({ topic }: { topic: KnowledgeTopic }) {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">{topic.category}</h2>
        <p className="mt-3">{topic.overview}</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Key Steps</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {topic.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {topic.importantNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Mistakes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {topic.commonMistakes.map((mistake) => (
            <li key={mistake}>{mistake}</li>
          ))}
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <p className="mt-2">{topic.nextStep}</p>
      </article>
    </section>
  );
}

function TrainingOverview() {
  return (
    <section className="rounded-lg border border-line bg-white p-4 text-sm leading-6 text-slate-700">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-ink">Overview</h2>
        <p className="mt-2">
          The LMX Content CMS Training Assistant is an internal learning and support tool designed to help users understand and operate the LMX Content CMS platform.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div>
          <h3 className="font-semibold text-signal">This assistant provides</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Step-by-step CMS guidance</li>
            <li>Device setup assistance</li>
            <li>Scheduling and publishing instructions</li>
            <li>Basic troubleshooting workflows</li>
            <li>Device compatibility checks</li>
            <li>Playlog and reporting guidance</li>
            <li>Programmatic DOOH operational support</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-signal">Training Scope</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Dashboard, network, location, playlist, and layout setup</li>
            <li>Device registration, scheduling, publishing, and storage</li>
            <li>Playlogs, troubleshooting, Android compatibility, and programmatic workflows</li>
            <li>CMS operational best practices</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-line bg-mist p-3">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>This assistant provides Level 1 operational guidance only.</li>
          <li>Always validate critical changes before production deployment.</li>
          <li>Escalate unresolved backend or system-related issues to the engineering team.</li>
          <li>Device compatibility depends on actual hardware capability, not only RAM or storage specifications.</li>
          <li>Verification codes for device pairing are one-time use only.</li>
        </ul>
      </div>

      <p className="mt-4">To begin the training, select a training topic from the available options and start asking your questions.</p>
      <p className="mt-2">
        Knowledge source: uploaded LMX Content training modules, troubleshooting guides, and operational documentation. For more detailed training documentation, refer to{" "}
        <a className="font-semibold text-signal underline" href="https://movingwallshub.atlassian.net/wiki/x/mYCKCQ" target="_blank" rel="noreferrer">
          Moving Walls Hub
        </a>.
      </p>
    </section>
  );
}

function TopicDetail({ topic }: { topic: KnowledgeTopic }) {
  return (
    <div className="rounded-md border border-line bg-mist p-3 text-sm text-slate-700">
      <h3 className="font-semibold text-ink">{topic.category}</h3>
      <p className="mt-1 leading-5">{topic.overview}</p>
      <div className="mt-3">
        <p className="font-medium text-signal">Key steps</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {topic.steps.slice(0, 5).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
      />
    </label>
  );
}

function FormattedResponse({ content }: { content: string }) {
  return <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{content}</p>;
}
