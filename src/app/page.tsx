"use client";

import {
  Clipboard,
  GraduationCap,
  Loader2,
  Lock,
  LogOut,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { issueCategories, lmxKnowledge, type IssueIntake } from "@/lib/lmxKnowledge";

type ChatSource = "openai" | "knowledge" | "local";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: ChatSource;
};

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
  "Train me how to create a network",
  "Train me how to create a location",
  "How do I create a playlist?",
  "How do I add and pair a device?",
  "How do I set up the default playlist?",
  "How do I schedule content?",
  "How do I publish content?",
  "How do I check playlogs?",
  "What are the Android device requirements?",
  "How do I schedule URL or VAST content?"
];

const responseSections = [
  "Overview:",
  "When to Use:",
  "Step-by-Step Guide:",
  "Important Notes:",
  "Common Mistakes:",
  "Next Step:"
];

export default function Home() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [intake, setIntake] = useState<IssueIntake>(emptyIntake);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  const learnerCompleteness = useMemo(() => {
    const required: Array<keyof IssueIntake> = ["clientTenant", "issueCategory"];
    const completed = required.filter((field) => Boolean(intake[field])).length;
    return Math.round((completed / required.length) * 100);
  }, [intake]);

  const selectedTopic = useMemo(
    () => lmxKnowledge.find((entry) => entry.category === intake.issueCategory),
    [intake.issueCategory]
  );

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

    if (!messageText || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: messageText }
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          intake,
          history: messages.map(({ role, content }) => ({ role, content }))
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed.");
      }

      const data = (await response.json()) as { reply: string; source: ChatSource };
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: data.reply, source: data.source }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          source: "local",
          content:
            "Overview:\nThe training assistant could not complete the request.\n\nWhen to Use:\n- This appears when the session, network, or chat API is unavailable.\n\nStep-by-Step Guide:\n- Confirm you are signed in\n- Refresh the page\n- Submit the training question again\n- Check server logs if the issue repeats\n\nImportant Notes:\n- The uploaded training module is still available after the app recovers.\n\nCommon Mistakes:\n- Continuing after the session has expired\n- Submitting with an unstable network connection\n\nNext Step:\nRefresh the page and ask the training question again."
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
              <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
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
            </div>
          </section>

          <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
            <h2 className="mb-3 font-semibold text-ink">Quick Lessons</h2>
            <div className="grid gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2 text-left text-sm text-slate-700 transition hover:border-signal hover:bg-teal-50"
                >
                  <span>{prompt}</span>
                  <Sparkles className="h-4 w-4 shrink-0 text-signal" aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="flex min-h-[760px] flex-col rounded-lg border border-line bg-white shadow-panel">
          <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slatePanel text-white">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-semibold text-ink">Training Chat</h2>
                <p className="text-sm text-slate-600">Step-by-step CMS guidance from the uploaded training module</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMessages([])}
              className="flex w-fit items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Clear
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-mist/50 p-4">
            {selectedTopic?.category === "Dashboard Overview" ? (
              <DashboardTrainingPage />
            ) : (
              <TrainingOverview selectedTopic={selectedTopic?.category} />
            )}

            {messages.length === 0 ? (
              <div className="rounded-md border border-dashed border-line bg-white px-4 py-3 text-center text-sm text-slate-500">
                Start a new training question from the chat input or quick lessons.
              </div>
            ) : null}

            {messages.map((message) => (
              <article
                key={message.id}
                className={message.role === "user" ? "ml-auto max-w-2xl rounded-lg bg-slatePanel p-4 text-white" : "max-w-3xl rounded-lg border border-line bg-white p-4 text-ink"}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{message.role === "user" ? "Training question" : "Training guide"}</p>
                    {message.source ? <p className="text-xs text-slate-500">{sourceLabel(message.source)}</p> : null}
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
                {message.role === "assistant" ? <FormattedResponse content={message.content} /> : <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>}
              </article>
            ))}

            {loading ? (
              <div className="flex max-w-3xl items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                Preparing step-by-step training guide...
              </div>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="border-t border-line bg-white p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                rows={2}
                className="min-h-14 flex-1 resize-none rounded-md border border-line px-3 py-2 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
                placeholder="Ask how to use LMX Content, for example: How do I schedule content?"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex min-h-14 items-center justify-center gap-2 rounded-md bg-signal px-5 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                Send
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

function TrainingOverview({ selectedTopic }: { selectedTopic?: string }) {
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

      <p className="mt-4">
        To begin the training, select a training topic from the available options and start asking your questions.
        {selectedTopic ? ` Current topic: ${selectedTopic}.` : ""}
      </p>
      <p className="mt-2">
        Knowledge source: uploaded LMX Content training modules, troubleshooting guides, and operational documentation. For more detailed training documentation, refer to{" "}
        <a className="font-semibold text-signal underline" href="https://movingwallshub.atlassian.net/wiki/x/mYCKCQ" target="_blank" rel="noreferrer">
          Moving Walls Hub
        </a>.
      </p>
    </section>
  );
}

function DashboardTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Dashboard Page</h2>
        <div className="mt-3 overflow-hidden rounded-md border border-line bg-white">
          <img
            src="/dashboard-page-screenshot.svg"
            alt="LMX Content CMS dashboard screenshot showing online devices, offline devices, unpaired devices, device table, online network chart, and storage indicator"
            className="w-full"
          />
        </div>

        <h3 className="mt-4 font-semibold text-signal">Overview</h3>
        <p className="mt-2">
          The Dashboard is the main landing page of the LMX Content CMS platform. It provides a high-level overview of device activity, network status, storage usage, and operational monitoring.
        </p>
        <p className="mt-2">
          This page helps users quickly monitor the health and status of the digital signage environment without navigating through multiple menus.
        </p>

        <h3 className="mt-4 font-semibold text-signal">The Dashboard is commonly used for</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Monitoring online and offline devices</li>
          <li>Checking unpaired devices</li>
          <li>Reviewing device connectivity</li>
          <li>Monitoring storage usage</li>
          <li>Viewing network activity</li>
          <li>Quickly identifying playback or operational issues</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Main Dashboard Components</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <DashboardComponent
            title="1. Online Device(s)"
            body="Displays the number of currently connected and active devices."
            items={["Verify active player connectivity", "Monitor operational screens", "Confirm devices are communicating with CMS"]}
            note="Green indicator: Device is online and reporting normally."
          />
          <DashboardComponent
            title="2. Offline Device(s)"
            body="Displays the number of devices currently disconnected or not communicating with CMS."
            items={["Internet issue", "Device powered off", "Player application stopped", "Network instability", "Device sleep mode", "Player crash"]}
            note="Recommended checks: internet connectivity, power source, player app status, and restart if necessary."
          />
          <DashboardComponent
            title="3. Unpaired Device(s)"
            body="Displays devices that are not yet paired or verified with the CMS platform."
            items={["Device created but not activated", "Incorrect verification code", "Pairing process incomplete", "Device reset or app data cleared"]}
            note="Verification codes are one-time use only."
          />
          <DashboardComponent
            title="4. Device Status Table"
            body="Displays device name, current connectivity status, and activity indicator."
            items={["Green = Online", "Yellow = Warning or unstable", "Red = Offline"]}
            note="Use this table to identify problematic devices and search by network or device name."
          />
          <DashboardComponent
            title="5. Network Filter"
            body="Allows users to filter devices by network."
            items={["Client-specific monitoring", "Regional troubleshooting", "Large deployment management"]}
            note="Example networks: Malaysia Network, Airport Network, Retail Branch Network."
          />
          <DashboardComponent
            title="6. Device Search"
            body="Search for a specific device using the device name or partial keyword."
            items={["Troubleshooting support calls", "Finding one device quickly", "Filtering large device lists"]}
          />
          <DashboardComponent
            title="7. Online Network Chart"
            body="Displays network activity visualization."
            items={["Monitor device distribution", "Understand network connectivity trends", "Identify active networks"]}
            note="Useful for operations monitoring, deployment visibility, and health checks."
          />
          <DashboardComponent
            title="8. Storage Indicator"
            body="Displays current storage usage and remaining storage capacity."
            items={["Prevent storage full issues", "Monitor content download capacity", "Identify potential playback risk"]}
            note="Low storage may cause content sync failure, playback issues, or application instability."
          />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Dashboard Checks</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-3">
          <Checklist title="When Device is Offline" items={["Internet connection", "Device power", "Player application status", "CMS heartbeat", "Firewall or network restriction"]} />
          <Checklist title="When Device Shows Online but Screen is Black" items={["HDMI or display source", "Published content", "Playlist assignment", "Content compatibility", "Player application health"]} />
          <Checklist title="When Devices are Unpaired" items={["Verification code validity", "Device mapping", "Player login status", "CMS pairing process"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Dashboard information updates based on device heartbeat and CMS communication.</li>
          <li>Device status may delay if internet connection is unstable.</li>
          <li>Offline devices may still display cached content locally.</li>
          <li>Storage usage should be monitored regularly to avoid content synchronization issues.</li>
        </ul>

        <h3 className="mt-4 font-semibold text-ink">Best Practice</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check offline device count daily.</li>
          <li>Review unpaired devices.</li>
          <li>Monitor storage usage.</li>
          <li>Validate active network distribution.</li>
          <li>Investigate abnormal status indicators immediately.</li>
        </ul>

        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Create Network</li>
          <li>Create Location</li>
          <li>Create Playlist</li>
          <li>Create Device</li>
          <li>Schedule Content</li>
        </ol>
      </article>
    </section>
  );
}

function DashboardComponent({
  title,
  body,
  items,
  note
}: {
  title: string;
  body: string;
  items: string[];
  note?: string;
}) {
  return (
    <div className="rounded-md border border-line bg-mist p-3">
      <h4 className="font-semibold text-signal">{title}</h4>
      <p className="mt-1">{body}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {note ? <p className="mt-2 font-medium text-slate-800">{note}</p> : null}
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-line bg-mist p-3">
      <h4 className="font-semibold text-signal">{title}</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function TopicDetail({ topic }: { topic: (typeof lmxKnowledge)[number] }) {
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

function Input({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
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

function sourceLabel(source: ChatSource) {
  if (source === "openai") return "OpenAI assisted";
  if (source === "knowledge") return "Uploaded training module";
  return "Local training knowledge";
}

function FormattedResponse({ content }: { content: string }) {
  const sections = responseSections
    .map((section, index) => {
      const start = content.indexOf(section);
      const nextStarts = responseSections
        .slice(index + 1)
        .map((next) => content.indexOf(next))
        .filter((position) => position > start);
      const end = nextStarts.length > 0 ? Math.min(...nextStarts) : content.length;
      return start === -1 ? null : { title: section.replace(":", ""), body: content.slice(start + section.length, end).trim() };
    })
    .filter(Boolean) as Array<{ title: string; body: string }>;

  if (sections.length === 0) {
    return <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{content}</p>;
  }

  return (
    <div className="grid gap-3">
      {sections.map((section) => (
        <div key={section.title} className="rounded-md border border-line bg-white p-3">
          <h3 className="mb-1.5 text-sm font-semibold text-signal">{section.title}</h3>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{section.body}</p>
        </div>
      ))}
    </div>
  );
}
