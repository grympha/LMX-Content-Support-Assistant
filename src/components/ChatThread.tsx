"use client";

import { Clipboard, History, Loader2, Plus, Send, X } from "lucide-react";
import { useEffect, useRef } from "react";
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
import {
  DashboardTrainingPage,
  LayoutTrainingPage,
  LocationTrainingPage,
  NetworkTrainingPage,
  PlaylistTrainingPage
} from "@/components/TrainingTopicPages";
import { lmxKnowledge } from "@/lib/lmxKnowledge";
import type { ChatAttachment, ChatMessage } from "@/lib/chatTypes";

type KnowledgeTopic = (typeof lmxKnowledge)[number];

const topicSourceLinks: Record<string, Array<{ label: string; url: string }>> = {
  "Dashboard Overview": [{ label: "Dashboard Overview", url: "https://movingwallshub.atlassian.net/wiki/x/JoGKCQ" }],
  "Create Network": [{ label: "Create a Network", url: "https://movingwallshub.atlassian.net/wiki/x/VIGKCQ" }],
  "Create Location": [{ label: "Create a Location", url: "https://movingwallshub.atlassian.net/wiki/x/a4GKCQ" }],
  "Create Playlist": [{ label: "Playlist Creation", url: "https://movingwallshub.atlassian.net/wiki/x/goGKCQ" }],
  "Create Layout": [{ label: "Layout Creation", url: "https://movingwallshub.atlassian.net/wiki/x/mYGKCQ" }],
  "Create Device": [{ label: "Create a Device", url: "https://movingwallshub.atlassian.net/wiki/x/sIGKCQ" }],
  "Device Pairing": [
    { label: "Create a Device", url: "https://movingwallshub.atlassian.net/wiki/x/sIGKCQ" },
    { label: "Pair LMX Inventory to Devices", url: "https://movingwallshub.atlassian.net/wiki/x/GA6MCQ" }
  ],
  "Storage Management": [{ label: "Storage", url: "https://movingwallshub.atlassian.net/wiki/x/74GKCQ" }],
  "Default Playlist": [{ label: "Default Playlist Guide", url: "https://movingwallshub.atlassian.net/wiki/x/h4KKCQ" }],
  "Schedule Content": [{ label: "How to Schedule Content", url: "https://movingwallshub.atlassian.net/wiki/x/0IKKCQ" }],
  "Bundle Scheduling": [{ label: "Scheduling Bundles", url: "https://movingwallshub.atlassian.net/wiki/x/R4OKCQ" }],
  "Publish Content": [{ label: "Unable to Publish – Error Guide", url: "https://movingwallshub.atlassian.net/wiki/x/zwCXDw" }],
  "Playlogs": [{ label: "Playlogs (General & Device Level)", url: "https://movingwallshub.atlassian.net/wiki/x/04GKCQ" }],
  "User Management": [
    { label: "How to Create a User", url: "https://movingwallshub.atlassian.net/wiki/x/FIOKCQ" },
    { label: "User Roles & Permissions", url: "https://movingwallshub.atlassian.net/wiki/x/KIOKCQ" }
  ],
  "Basic Troubleshooting": [{ label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" }],
  "Installation of LMX Content App": [
    { label: "Installation Guide (Android & Windows)", url: "https://movingwallshub.atlassian.net/wiki/x/AoCTDw" },
    { label: "Download MW Content App", url: "https://movingwallshub.atlassian.net/wiki/x/V4CTDw" }
  ],
  "Supported Operating Systems & Hardware": [
    { label: "System Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/cgqMCQ" },
    { label: "Device & Platform Technical Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/aoCTDw" }
  ],
  "Programmatic / VAST": [{ label: "Schedule URL & Google IMA (VAST)", url: "https://movingwallshub.atlassian.net/wiki/x/AQCXDw" }]
};

type FeedbackRating = "good" | "bad";
type FeedbackStatus = FeedbackRating | "pending" | "error";

type ChatThreadProps = {
  messages: ChatMessage[];
  loading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onNewTopic: () => void;
  onOpenHistory?: () => void;
  attachments: ChatAttachment[];
  onRemoveAttachment: (name: string) => void;
  onAttachClick: () => void;
  hasAiProvider: boolean;
  selectedTopic?: KnowledgeTopic;
  onFeedback?: (messageId: string, rating: FeedbackRating) => void;
  feedbackState?: Record<string, FeedbackStatus>;
};

export function ChatThread({
  messages,
  loading,
  input,
  onInputChange,
  onSend,
  onNewTopic,
  onOpenHistory,
  attachments,
  onRemoveAttachment,
  onAttachClick,
  hasAiProvider,
  selectedTopic,
  onFeedback,
  feedbackState,
}: ChatThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const el = replyTextareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 128) + "px";
  }, [input]);

  return (
    <section className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-lg border border-line bg-mist/50 shadow-panel lg:sticky lg:top-4">
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Current Topic Conversation</span>
              <div className="flex-1 border-t border-line" />
            </div>
            {messages.map((message) => (
              <article
                key={message.id}
                className={message.role === "user" ? "w-full rounded-lg bg-slatePanel p-4 text-white" : "w-full rounded-lg border border-line bg-white p-4 text-ink"}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">{message.role === "user" ? "You" : "Assistant"}</p>
                    {message.role === "assistant" && message.source ? (
                      <span className="rounded-full bg-signal/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-signal">
                        {message.source === "openai" ? "OpenAI" : message.source === "claude" ? "Claude" : message.source === "mistral" ? "Mistral" : message.source === "knowledge" ? "Knowledge" : "Local"}
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
                    {message.sourceNotes && message.sourceNotes.length > 0 ? (
                      <div className="mt-3 border-t border-line pt-3">
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Sources used</p>
                        <div className="flex flex-wrap gap-1.5">
                          {message.sourceNotes.map((note, i) => (
                            <span key={i} className="inline-flex items-center gap-1 rounded border border-line bg-mist px-2 py-0.5 text-[11px] text-slate-500">
                              <span className="text-slate-400">{note.folder}</span>
                              <span className="mx-0.5 text-slate-300">/</span>
                              <span className="font-medium text-slate-600">{note.file.replace(/\.md$/i, "")}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
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
                    {onFeedback ? (
                      <FeedbackBar
                        messageId={message.id}
                        status={feedbackState?.[message.id]}
                        onFeedback={onFeedback}
                      />
                    ) : null}
                  </>
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                )}
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
          <>
            <TopicContent selectedTopic={selectedTopic} />
            {selectedTopic && (topicSourceLinks[selectedTopic.category] ?? []).length > 0 ? (
              <div className="mt-4 rounded-lg border border-line bg-white p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">Further reading</p>
                <div className="flex flex-wrap gap-2">
                  {(topicSourceLinks[selectedTopic.category] ?? []).map((link) => (
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
        )}
      </div>

      {/* Sticky reply bar — shown once the conversation has started */}
      {messages.length > 0 ? (
        <div className="border-t border-line bg-white p-3">
          {/* Mobile-only shortcuts: start a new topic or open history without scrolling */}
          <div className="mx-auto mb-3 flex gap-2 max-w-3xl lg:hidden">
            <button
              type="button"
              onClick={onNewTopic}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-md border border-line bg-mist px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              New Topic
            </button>
            {onOpenHistory ? (
              <button
                type="button"
                onClick={onOpenHistory}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-md border border-line bg-mist px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-signal hover:text-signal disabled:cursor-not-allowed disabled:opacity-50"
              >
                <History className="h-3.5 w-3.5" aria-hidden="true" />
                History
              </button>
            ) : null}
          </div>
          <div className="mx-auto mb-3 max-w-3xl">
            <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Follow-up Questions</p>
            <p className="text-xs text-slate-400">
              Continue discussing the current topic. To start a new question or topic, use{" "}
              <span className="font-medium text-slate-500">Ask Assistant</span> on the left.
            </p>
          </div>
          {attachments.length > 0 ? (
            <div className="mx-auto mb-2 flex max-w-3xl flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div key={attachment.name} className="flex items-center gap-1.5 rounded border border-line bg-mist px-2.5 py-1 text-xs text-slate-600">
                  <span className="max-w-[180px] truncate">{attachment.name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(attachment.name)}
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded text-slate-400 hover:text-signal"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSend();
            }}
            className="mx-auto flex max-w-3xl items-end gap-2"
          >
            <textarea
              ref={replyTextareaRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              rows={1}
              disabled={loading}
              className="flex-1 resize-none overflow-hidden rounded-lg border border-line px-3 py-2.5 text-sm outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20 disabled:bg-slate-50"
              placeholder="Continue this conversation… (Shift+Enter for new line)"
            />
            {hasAiProvider ? (
              <button
                type="button"
                onClick={onAttachClick}
                title="Attach file"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-slate-600 transition hover:border-signal hover:text-signal"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
            <button
              type="submit"
              disabled={loading || (!input.trim() && attachments.length === 0)}
              title="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-signal text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
            </button>
          </form>
        </div>
      ) : null}
    </section>
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
          The LMX Content CMS Support & Training Assistant is an internal support and training tool designed to help users understand and operate the LMX Content CMS platform.
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

function FormattedResponse({ content }: { content: string }) {
  return <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{content}</p>;
}

function FeedbackBar({
  messageId,
  status,
  onFeedback,
}: {
  messageId: string;
  status?: FeedbackStatus;
  onFeedback: (id: string, rating: FeedbackRating) => void;
}) {
  return (
    <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
      {status === "good" || status === "bad" ? (
        <>
          <span className="text-sm">{status === "good" ? "👍" : "👎"}</span>
          <span className="text-xs text-slate-500">Thanks for your feedback.</span>
          <button
            type="button"
            onClick={() => onFeedback(messageId, status === "good" ? "bad" : "good")}
            className="ml-1 text-xs text-slate-400 underline hover:text-slate-600"
          >
            Change
          </button>
        </>
      ) : status === "error" ? (
        <p className="text-xs text-red-500">Unable to save feedback.</p>
      ) : (
        <>
          <p className="text-xs text-slate-400">Was this helpful?</p>
          <button
            type="button"
            onClick={() => onFeedback(messageId, "good")}
            disabled={status === "pending"}
            className="flex items-center gap-1 rounded border border-line px-2.5 py-1 text-xs text-slate-600 transition hover:border-signal hover:text-signal disabled:opacity-50"
          >
            {status === "pending" ? (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            ) : (
              "👍"
            )}{" "}
            Good
          </button>
          <button
            type="button"
            onClick={() => onFeedback(messageId, "bad")}
            disabled={status === "pending"}
            className="flex items-center gap-1 rounded border border-line px-2.5 py-1 text-xs text-slate-600 transition hover:border-signal hover:text-signal disabled:opacity-50"
          >
            {status === "pending" ? (
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
            ) : (
              "👎"
            )}{" "}
            Bad
          </button>
        </>
      )}
    </div>
  );
}
