"use client";

import { Loader2, Plus, Send, Trash2, X } from "lucide-react";
import { useMemo, type RefObject } from "react";
import { ProgressPanel } from "@/components/ProgressPanel";
import { commonQuestions } from "@/lib/commonQuestions";
import { issueCategories, lmxKnowledge, type IssueIntake } from "@/lib/lmxKnowledge";
import type { ChatAttachment } from "@/lib/chatTypes";

type KnowledgeTopic = (typeof lmxKnowledge)[number];

const trackableTopicCount = issueCategories.filter((category) => category !== "Other").length;

type IntakeSidebarProps = {
  username: string;
  intake: IssueIntake;
  onIntakeChange: <K extends keyof IssueIntake>(field: K, value: IssueIntake[K]) => void;
  loading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  attachments: ChatAttachment[];
  onRemoveAttachment: (name: string) => void;
  onAttachClick: () => void;
  hasAiProvider: boolean;
  selectedCommonQuestion: string;
  onSelectCommonQuestion: (question: string) => void;
  onClearMessages: () => void;
  selectedTopic?: KnowledgeTopic;
  askAssistantSectionRef?: RefObject<HTMLElement | null>;
  askAssistantInputRef?: RefObject<HTMLTextAreaElement | null>;
};

export function IntakeSidebar({
  username,
  intake,
  onIntakeChange,
  loading,
  input,
  onInputChange,
  onSend,
  attachments,
  onRemoveAttachment,
  onAttachClick,
  hasAiProvider,
  selectedCommonQuestion,
  onSelectCommonQuestion,
  onClearMessages,
  selectedTopic,
  askAssistantSectionRef,
  askAssistantInputRef,
}: IntakeSidebarProps) {
  const learnerCompleteness = useMemo(() => {
    const required: Array<keyof IssueIntake> = ["clientTenant", "issueCategory"];
    const completed = required.filter((field) => Boolean(intake[field])).length;
    return Math.round((completed / required.length) * 100);
  }, [intake]);

  return (
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
          <Input
            label="Full Name"
            value={intake.clientTenant}
            onChange={(value) => onIntakeChange("clientTenant", value)}
            placeholder="Person taking this training"
          />
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Training Topic</span>
            <select
              value={intake.issueCategory}
              onChange={(event) => onIntakeChange("issueCategory", event.target.value as IssueIntake["issueCategory"])}
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

      <section ref={askAssistantSectionRef} className="rounded-lg border border-line bg-white p-4 shadow-panel">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-semibold text-ink">Ask Assistant</h2>
          <button
            type="button"
            onClick={onClearMessages}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600 transition hover:border-signal hover:text-signal"
            title="Clear answer"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSend();
          }}
          className="grid gap-3"
        >
          <textarea
            ref={askAssistantInputRef}
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
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
                    onClick={() => onRemoveAttachment(attachment.name)}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-line bg-white text-slate-500 hover:border-signal hover:text-signal"
                    title="Remove attachment"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <button
            type="submit"
            disabled={loading || (!input.trim() && attachments.length === 0)}
            className="flex min-h-11 items-center justify-center gap-2 rounded-md bg-signal px-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
            Send
          </button>
          {hasAiProvider ? (
            <button
              type="button"
              onClick={onAttachClick}
              className="flex min-h-10 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-signal hover:text-signal"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Attach file
            </button>
          ) : null}
        </form>
      </section>

      <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
        <h2 className="mb-3 font-semibold text-ink">Frequently Asked Questions (FAQ)</h2>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Question</span>
          <select
            value={selectedCommonQuestion}
            onChange={(event) => onSelectCommonQuestion(event.target.value)}
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

      <section className="rounded-lg border border-line bg-white p-4 shadow-panel">
        <div className="mb-3">
          <h2 className="font-semibold text-ink">Workflow Shortcuts</h2>
          <p className="mt-1 text-xs text-slate-500">
            Common operational workflows that guide users through multi-step tasks.
          </p>
        </div>
        <div className="grid gap-2">
          {WORKFLOW_SHORTCUTS.map((shortcut) => (
            <button
              key={shortcut.label}
              type="button"
              onClick={() => {
                onInputChange(shortcut.prefill);
                requestAnimationFrame(() => {
                  askAssistantSectionRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  askAssistantInputRef?.current?.focus({ preventScroll: true });
                });
              }}
              className="flex items-center gap-2 rounded-md border border-line bg-mist px-3 py-2 text-left text-sm text-slate-700 transition hover:border-signal hover:bg-signal/5 hover:text-signal"
            >
              <span className="shrink-0 text-base leading-none">{shortcut.icon}</span>
              <span className="font-medium">{shortcut.label}</span>
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
}

const WORKFLOW_SHORTCUTS = [
  {
    label: "Create New Device",
    icon: "🖥️",
    prefill: "Guide me through creating and pairing a new device from start to finish.",
  },
  {
    label: "Deploy New Screen",
    icon: "📺",
    prefill: "What are the complete steps to deploy a new screen in LMX Content?",
  },
  {
    label: "Troubleshoot Offline Device",
    icon: "🔧",
    prefill: "My device is offline. Guide me through troubleshooting.",
  },
  {
    label: "Check Device Compatibility",
    icon: "✅",
    prefill: "Check if my device meets LMX Content requirements.",
  },
  {
    label: "Schedule Campaign",
    icon: "📅",
    prefill: "Guide me through scheduling content for a campaign.",
  },
  {
    label: "Programmatic Readiness Check",
    icon: "📡",
    prefill: "Validate if this device is ready for VAST and Programmatic campaigns.",
  },
  {
    label: "Content Deployment Checklist",
    icon: "📋",
    prefill: "Provide the deployment checklist before publishing content.",
  },
  {
    label: "Generate Support Checklist",
    icon: "🎫",
    prefill: "What information should I collect before escalating a support ticket?",
  },
] as const;

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
