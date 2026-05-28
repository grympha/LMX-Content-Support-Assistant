"use client";

import {
  Clipboard,
  Loader2,
  Lock,
  LogOut,
  Send,
  ShieldCheck,
  Trash2
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AppInstallationTrainingPage } from "@/components/AppInstallationTrainingPage";
import { BundleSchedulingTrainingPage } from "@/components/BundleSchedulingTrainingPage";
import { DefaultPlaylistTrainingPage } from "@/components/DefaultPlaylistTrainingPage";
import { DevicePairingTrainingPage } from "@/components/DevicePairingTrainingPage";
import { DeviceTrainingPage } from "@/components/DeviceTrainingPage";
import { PlaylogTrainingPage } from "@/components/PlaylogTrainingPage";
import { PublishContentTrainingPage } from "@/components/PublishContentTrainingPage";
import { ScheduleContentTrainingPage } from "@/components/ScheduleContentTrainingPage";
import { StorageManagementTrainingPage } from "@/components/StorageManagementTrainingPage";
import { SupportedHardwareTrainingPage } from "@/components/SupportedHardwareTrainingPage";
import { UserManagementTrainingPage } from "@/components/UserManagementTrainingPage";
import { DashboardTrainingPage, LayoutTrainingPage, LocationTrainingPage, NetworkTrainingPage, PlaylistTrainingPage } from "@/components/TrainingTopicPages";
import { issueCategories, lmxKnowledge, type IssueIntake } from "@/lib/lmxKnowledge";

type ChatSource = "openai" | "knowledge" | "local";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: ChatSource;
};

type CommonQuestion = {
  question: string;
  answer: string;
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

const commonQuestions: CommonQuestion[] = [
  {
    question: "How do I schedule content?",
    answer:
      "Schedule Content\n\nNavigate to Dashboard > Schedule Content. Select the Network, Location, and Playlist.\n\nKey steps\n- Configure date and time\n- Save the schedule\n- Approve content\n- Publish content\n- Remember: content will not play until it is published"
  },
  {
    question: "Why is the Default Playlist showing?",
    answer:
      "Default Playlist Showing\n\nDefault Playlist appears when scheduled or targeted content is not available for playback.\n\nKey checks\n- Check if there is no active schedule\n- Check if the campaign expired\n- Check if content was published\n- Check if impression cap was reached\n- Check synchronization status\n- Check device online status"
  },
  {
    question: "Client reports black screen. What should I check?",
    answer:
      "Black Screen\n\nBlack screen can come from device, CMS, content, storage, network, or display issues.\n\nKey checks\n- Check device online status\n- Check playlist assignment\n- Check publish status\n- Check HDMI/display connection\n- Check supported media format\n- Check device storage availability"
  },
  {
    question: "What is the recommended Android specification?",
    answer:
      "Android Specification\n\nRecommended Android hardware improves playback stability, HTML rendering, and VAST support.\n\nRecommended\n- Android 11+\n- 8GB RAM / 128GB Storage\n- 64-bit\n- Quad-core CPU\n\nMinimum\n- 4GB RAM / 64GB Storage"
  },
  {
    question: "Can 2GB RAM Android devices support LMX Content?",
    answer:
      "2GB Android Devices\n\n2GB RAM Android devices may support basic playback only, but they are not recommended for production use.\n\nLimitations\n- Unstable HTML rendering\n- VAST issues\n- Black screen risk\n- Slow synchronization\n- Not recommended for programmatic campaigns, heavy HTML, or split layouts"
  },
  {
    question: "Why is old content still showing?",
    answer:
      "Old Content Still Showing\n\nOld content usually means the device has not received or applied the latest update.\n\nPossible causes\n- Device offline\n- Synchronization failed\n- Content not published\n- Cached content still active\n\nRecommended action\n- Republish content\n- Verify synchronization\n- Restart player if necessary"
  },
  {
    question: "Why is the device offline?",
    answer:
      "Device Offline\n\nA device is offline when it is not communicating with CMS.\n\nPossible causes\n- Internet instability\n- Firewall restriction\n- Player stopped\n- Device powered off\n\nKey checks\n- Internet connection\n- Player application status\n- Firewall/network access"
  },
  {
    question: "How do I pair a new device?",
    answer:
      "Device Pairing\n\nPairing links the physical player to the CMS device record.\n\nKey steps\n- Create Device\n- Install Player\n- Launch Player\n- Generate Verification Code\n- Pair Device\n- Remember: verification codes are one-time use only"
  },
  {
    question: "Why is content uploaded but not playing?",
    answer:
      "Uploaded Content Not Playing\n\nUploaded content will not play until it is assigned, scheduled, approved, and published.\n\nPossible causes\n- Playlist not assigned\n- Schedule missing\n- Content not published\n- Unsupported format\n\nKey checks\n- Playlist\n- Schedule\n- Publish status\n- Media compatibility"
  },
  {
    question: "What formats are supported?",
    answer:
      "Supported Formats\n\nOnly supported formats should be uploaded and scheduled for playback.\n\nSupported\n- MP4\n- PNG\n- JPEG\n- GIF\n- MP3\n- PDF\n- HTML5 ZIP\n\nUnsupported formats may fail playback."
  },
  {
    question: "How do I generate Playlogs?",
    answer:
      "Generate Playlogs\n\nUse Playlog to export playback records for reporting and verification.\n\nKey steps\n- Go to Dashboard > Playlog\n- Select date range\n- Select device\n- Select content filter\n- Click Get Log"
  },
  {
    question: "Why are Playlogs missing?",
    answer:
      "Missing Playlogs\n\nMissing playlogs usually mean playback did not happen, the device did not sync, or the report range is incorrect.\n\nPossible causes\n- Device offline\n- Playback not triggered\n- Synchronization delay\n- Player stopped\n\nImportant\n- General Playlog = 30 days limit"
  },
  {
    question: "Why is VAST or URL content not playing?",
    answer:
      "VAST or URL Not Playing\n\nVAST and URL playback depend on platform support, WebView/browser compatibility, internet, and creative delivery.\n\nPossible causes\n- Outdated WebView\n- SSP no-fill\n- Unsupported creative\n- Unstable internet\n\nRecommended\n- Android 11+\n- WebView Version 100+"
  },
  {
    question: "How do I update the player application?",
    answer:
      "Update Player Application\n\nInstall the new version directly without uninstalling the previous version.\n\nPurpose\n- Preserves device pairing\n- Preserves cache\n- Preserves configuration"
  },
  {
    question: "Why can't a user access certain features?",
    answer:
      "User Feature Access\n\nFeature access depends on role, permissions, account status, and network restrictions.\n\nPossible causes\n- Incorrect role assignment\n- Insufficient permissions\n- Network restriction\n\nKey checks\n- User role\n- Assigned permissions\n- Account status"
  },
  {
    question: "Why is content synchronization slow?",
    answer:
      "Slow Content Synchronization\n\nSlow sync can be caused by network, file size, storage, or device performance.\n\nPossible causes\n- Unstable internet\n- Oversized content\n- Storage limitation\n- Weak hardware\n\nRecommended\n- Optimize media files\n- Use stable internet\n- Verify storage availability"
  },
  {
    question: "What causes black screen during HTML playback?",
    answer:
      "HTML Black Screen\n\nHTML playback needs enough device resources and an updated rendering engine.\n\nPossible causes\n- Low RAM device\n- Outdated WebView\n- Unsupported HTML\n- Oversized ZIP package\n\nRecommended\n- Android 11+\n- 4GB RAM minimum\n- Updated WebView"
  },
  {
    question: "How do I restart Windows player pairing?",
    answer:
      "Restart Windows Player Pairing\n\nUse Ctrl + L on the Windows player.\n\nPurpose\n- Logs out the player\n- Resets pairing\n- Allows the device to be paired again"
  },
  {
    question: "Why is the device online but not updating?",
    answer:
      "Device Online but Not Updating\n\nAn online device may still fail to update if sync, storage, publish, or internet stability has an issue.\n\nPossible causes\n- Synchronization failure\n- Storage full\n- Publish incomplete\n- Internet instability\n\nKey checks\n- Synchronization status\n- Publish status\n- Device storage"
  },
  {
    question: "What is the purpose of Default Playlist?",
    answer:
      "Default Playlist Purpose\n\nDefault Playlist acts as fallback playback content.\n\nUsed when\n- No active campaign\n- Failed synchronization\n- No-fill programmatic response\n- Schedule expired"
  }
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
  const [selectedCommonQuestion, setSelectedCommonQuestion] = useState("");
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

    const questionIntake: IssueIntake = {
      ...intake,
      issueCategory: "",
      description: messageText
    };

    setSelectedCommonQuestion("");
    setIntake(questionIntake);
    setMessages([{ id: crypto.randomUUID(), role: "user", content: messageText }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          intake: questionIntake,
          history: []
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
            "Please refresh the page and ask the training question again. If it still fails, check the app server logs."
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

  function selectCommonQuestion(question: string) {
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
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex min-h-11 items-center justify-center gap-2 rounded-md bg-signal px-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                Send
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
                    <p className="text-sm font-semibold">{message.role === "user" ? "Question" : "Answer"}</p>
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
                <div className="flex w-full items-center gap-3 rounded-lg border border-line bg-white p-4 text-sm text-slate-600">
                  <Loader2 className="h-4 w-4 animate-spin text-signal" aria-hidden="true" />
                  Searching all training topics...
                </div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>
          ) : selectedTopic?.category === "Dashboard Overview" ? (
            <DashboardTrainingPage />
          ) : selectedTopic?.category === "Create Network" ? (
            <NetworkTrainingPage />
          ) : selectedTopic?.category === "Create Location" ? (
            <LocationTrainingPage />
          ) : selectedTopic?.category === "Create Playlist" ? (
            <PlaylistTrainingPage />
          ) : selectedTopic?.category === "Create Layout" ? (
            <LayoutTrainingPage />
          ) : selectedTopic?.category === "Create Device" ? (
            <DeviceTrainingPage />
          ) : selectedTopic?.category === "Device Pairing" ? (
            <DevicePairingTrainingPage />
          ) : selectedTopic?.category === "Storage Management" ? (
            <StorageManagementTrainingPage />
          ) : selectedTopic?.category === "Default Playlist" ? (
            <DefaultPlaylistTrainingPage />
          ) : selectedTopic?.category === "Schedule Content" ? (
            <ScheduleContentTrainingPage />
          ) : selectedTopic?.category === "Bundle Scheduling" ? (
            <BundleSchedulingTrainingPage />
          ) : selectedTopic?.category === "Publish Content" ? (
            <PublishContentTrainingPage />
          ) : selectedTopic?.category === "Playlogs" ? (
            <PlaylogTrainingPage />
          ) : selectedTopic?.category === "User Management" ? (
            <UserManagementTrainingPage />
          ) : selectedTopic?.category === "Installation of LMX Content App" ? (
            <AppInstallationTrainingPage />
          ) : selectedTopic?.category === "Supported Operating Systems & Hardware" ? (
            <SupportedHardwareTrainingPage />
          ) : (
            <TrainingOverview selectedTopic={selectedTopic?.category} />
          )}
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
