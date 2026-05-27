"use client";

import { Clipboard, Loader2, Lock, LogOut, MessageSquareText, Send, ShieldCheck, Sparkles, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { issueCategories, type IssueIntake } from "@/lib/lmxKnowledge";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string; source?: "openai" | "local" };

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

const quickPrompts = [
  "How do I schedule content?",
  "Can this Android device support LMX Content?",
  "Client reports black screen, what should I do?",
  "Why is default playlist showing?",
  "Device offline but screen is still playing",
  "Missing playlog",
  "Content not syncing",
  "Device pairing issue",
  "Publishing issue",
  "Programmatic issue"
];

const responseSections = ["Summary:", "Possible Cause:", "Checks Required:", "Recommended Action:", "Escalation Needed:", "Client Reply Draft:"];

export default function Home() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [intake, setIntake] = useState<IssueIntake>(emptyIntake);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      source: "local",
      content: "Summary:\nReady to help with LMX Content CMS support cases.\n\nPossible Cause:\n- Select an issue category or describe the case to start structured troubleshooting.\n\nChecks Required:\n- Client / Tenant\n- Device name\n- Device OS\n- Issue category\n- Description\n\nRecommended Action:\nUse the intake form for case context, then ask the support question in the chat.\n\nEscalation Needed:\nNot yet. Escalation depends on the checks and evidence collected.\n\nClient Reply Draft:\nWe are reviewing the case details and will verify the relevant device, CMS, content, and network checks before advising next steps."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/auth")
      .then((response) => response.json())
      .then((data: { authenticated: boolean }) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const caseCompleteness = useMemo(() => {
    const required: Array<keyof IssueIntake> = ["clientTenant", "deviceName", "deviceOs", "issueCategory", "description"];
    const completed = required.filter((field) => Boolean(intake[field])).length;
    return Math.round((completed / required.length) * 100);
  }, [intake]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setAuthError(data.error ?? "Unable to sign in.");
      return;
    }

    setAuthenticated(true);
    setPassword("");
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
  }

  async function sendMessage(text = input) {
    const messageText = text.trim();
    if (!messageText || loading) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: messageText };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          intake,
          history: messages.filter((message) => message.id !== "welcome").map(({ role, content }) => ({ role, content }))
        })
      });

      if (!response.ok) throw new Error("Chat request failed.");
      const data = (await response.json()) as { reply: string; source: "openai" | "local" };
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: data.reply, source: data.source }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          source: "local",
          content: "Summary:\nThe assistant could not complete the request.\n\nPossible Cause:\n- Session expired\n- Network interruption\n- API route unavailable\n\nChecks Required:\n- Confirm you are signed in\n- Retry the request\n- Check server logs if the issue repeats\n\nRecommended Action:\nRefresh the page and submit the message again.\n\nEscalation Needed:\nEscalate to the app maintainer if the error repeats after refresh.\n\nClient Reply Draft:\nWe are checking the support assistant availability and will continue troubleshooting once the request can be processed."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function updateIntake<K extends keyof IssueIntake>(field: K, value: IssueIntake[K]) {
    setIntake((current) => ({ ...current, [field]: value }));
  }

  if (!authChecked) {
    return <main className="flex min-h-screen items-center justify-center px-4"><Loader2 className="h-7 w-7 animate-spin text-signal" aria-label="Loading" /></main>;
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4 py-10">
        <section className="w-full max-w-md rounded-lg border border-line bg-white p-7 shadow-panel">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-slatePanel text-white"><Lock className="h-5 w-5" aria-hidden="true" /></div>
            <div>
              <h1 className="text-xl font-semibold text-ink">LMX Content Support Assistant</h1>
              <p className="text-sm text-slate-600">Internal access only</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20" autoFocus />
            </label>
            {authError ? <p className="text-sm text-red-600">{authError}</p> : null}
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-signal px-4 py-2.5 font-semibold text-white transition hover:bg-teal-800"><ShieldCheck className="h-4 w-4" aria-hidden="true" />Enter assistant</button>
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
            <h1 className="text-2xl font-semibold text-ink">Support Assistant</h1>
          </div>
          <button type="button" onClick={handleLogout} className="flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"><LogOut className="h-4 w-4" aria-hidden="true" />Sign out</button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div><h2 className="font-semibold text-ink">Issue Intake</h2><p className="text-sm text-slate-600">Case context for better answers</p></div>
              <div className="min-w-14 rounded-md bg-mist px-2 py-1 text-center text-sm font-semibold text-slate-700">{caseCompleteness}%</div>
            </div>
            <div className="grid gap-3">
              <Input label="Client / Tenant" value={intake.clientTenant} onChange={(value) => updateIntake("clientTenant", value)} />
              <Input label="Network" value={intake.network} onChange={(value) => updateIntake("network", value)} />
              <Input label="Location" value={intake.location} onChange={(value) => updateIntake("location", value)} />
              <Input label="Device Name" value={intake.deviceName} onChange={(value) => updateIntake("deviceName", value)} />
              <Input label="Device OS" value={intake.deviceOs} onChange={(value) => updateIntake("deviceOs", value)} placeholder="Android 11, Windows, Tizen..." />
              <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700">Issue Category</span><select value={intake.issueCategory} onChange={(event) => updateIntake("issueCategory", event.target.value as IssueIntake["issueCategory"])} className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"><option value="">Select category</option>{issueCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
              <Input label="Content / Campaign" value={intake.contentCampaign} onChange={(value) => updateIntake("contentCampaign", value)} />
              <Input label="Start Time" value={intake.startTime} onChange={(value) => updateIntake("startTime", value)} placeholder="Date, time, timezone" />
              <Input label="Screenshot / Video Link" value={intake.mediaLink} onChange={(value) => updateIntake("mediaLink", value)} />
              <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700">Description</span><textarea value={intake.description} onChange={(event) => updateIntake("description", event.target.value)} rows={4} className="w-full resize-none rounded-md border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20" placeholder="What happened, when it started, and what the client sees" /></label>
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <h2 className="mb-3 font-semibold text-ink">Quick Categories</h2>
            <div className="grid gap-2">{quickPrompts.map((prompt) => <button key={prompt} type="button" onClick={() => sendMessage(prompt)} className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2 text-left text-sm text-slate-700 transition hover:border-signal hover:bg-teal-50"><span>{prompt}</span><Sparkles className="h-4 w-4 shrink-0 text-signal" aria-hidden="true" /></button>)}</div>
          </section>
        </aside>

        <section className="flex min-h-[760px] flex-col rounded-lg border border-line bg-white shadow-panel">
          <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-md bg-slatePanel text-white"><MessageSquareText className="h-5 w-5" aria-hidden="true" /></div><div><h2 className="font-semibold text-ink">Troubleshooting Chat</h2><p className="text-sm text-slate-600">Structured support replies with local fallback knowledge</p></div></div>
            <button type="button" onClick={() => setMessages([])} className="flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"><Trash2 className="h-4 w-4" aria-hidden="true" />Clear</button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-mist/50 p-4">
            {messages.length === 0 ? <div className="flex h-full min-h-[320px] items-center justify-center text-center text-slate-500">Start a new support question from the chat input or quick categories.</div> : null}
            {messages.map((message) => <article key={message.id} className={message.role === "user" ? "ml-auto max-w-2xl rounded-lg bg-slatePanel p-4 text-white" : "max-w-3xl rounded-lg border border-line bg-white p-4 text-ink"}><div className="mb-3 flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{message.role === "user" ? "Support question" : "Assistant response"}</p>{message.source ? <p className="text-xs text-slate-500">{message.source === "openai" ? "OpenAI assisted" : "Local knowledge base"}</p> : null}</div>{message.role === "assistant" ? <button type="button" onClick={() => navigator.clipboard.writeText(message.content)} className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal" title="Copy response"><Clipboard className="h-4 w-4" aria-hidden="true" /></button> : null}</div>{message.role === "assistant" ? <FormattedResponse content={message.content} /> : <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>}</article>)}
            {loading ? <div className="flex max-w-3xl items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm text-slate-600"><Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />Preparing structured support response...</div> : null}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="border-t border-line bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row"><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={2} className="min-h-14 flex-1 resize-none rounded-md border border-line px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20" placeholder="Ask a support question or paste the client issue..." /><button type="submit" disabled={loading || !input.trim()} className="flex min-h-14 items-center justify-center gap-2 rounded-md bg-signal px-5 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300">{loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}Send</button></div>
          </form>
        </section>
      </div>
    </main>
  );
}

function Input({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span><input value={value ?? ""} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20" /></label>;
}

function FormattedResponse({ content }: { content: string }) {
  const sections = responseSections.map((section, index) => {
    const start = content.indexOf(section);
    const nextStarts = responseSections.slice(index + 1).map((next) => content.indexOf(next)).filter((position) => position > start);
    const end = nextStarts.length > 0 ? Math.min(...nextStarts) : content.length;
    return start === -1 ? null : { title: section.replace(":", ""), body: content.slice(start + section.length, end).trim() };
  }).filter(Boolean) as Array<{ title: string; body: string }>;

  if (sections.length === 0) return <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{content}</p>;
  return <div className="grid gap-3">{sections.map((section) => <div key={section.title} className="rounded-md border border-line bg-white p-3"><h3 className="mb-1.5 text-sm font-semibold text-signal">{section.title}</h3><p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{section.body}</p></div>)}</div>;
}
