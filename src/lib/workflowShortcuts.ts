/**
 * Workflow Shortcuts Registry
 *
 * Single source of truth for all workflow shortcut definitions.
 * Imported by IntakeSidebar and the analytics event system.
 * Metadata mirrors knowledge/workflows/metadata.json.
 */

export type WorkflowShortcut = {
  readonly id: string;
  readonly slug: string;
  readonly label: string;
  readonly icon: string;
  readonly prefill: string;
  readonly category: string;
  readonly difficulty: "beginner" | "intermediate" | "advanced";
  readonly estimatedMinutes: number;
  readonly analyticsLabel: string;
  readonly workflowFile: string;
};

export const WORKFLOW_SHORTCUTS: readonly WorkflowShortcut[] = [
  {
    id: "wf-001",
    slug: "create-new-device",
    label: "Create New Device",
    icon: "🖥️",
    prefill: "Guide me through creating and pairing a new device from start to finish.",
    category: "Device Setup",
    difficulty: "beginner",
    estimatedMinutes: 15,
    analyticsLabel: "Create New Device",
    workflowFile: "knowledge/workflows/create-new-device.md",
  },
  {
    id: "wf-002",
    slug: "deploy-new-screen",
    label: "Deploy New Screen",
    icon: "📺",
    prefill: "What are the complete steps to deploy a new screen in LMX Content?",
    category: "Screen Deployment",
    difficulty: "intermediate",
    estimatedMinutes: 30,
    analyticsLabel: "Deploy New Screen",
    workflowFile: "knowledge/workflows/deploy-new-screen.md",
  },
  {
    id: "wf-003",
    slug: "troubleshoot-offline-device",
    label: "Troubleshoot Offline Device",
    icon: "🔧",
    prefill: "My device is offline. Guide me through troubleshooting.",
    category: "Troubleshooting",
    difficulty: "intermediate",
    estimatedMinutes: 20,
    analyticsLabel: "Troubleshoot Offline Device",
    workflowFile: "knowledge/workflows/troubleshoot-offline-device.md",
  },
  {
    id: "wf-004",
    slug: "check-device-compatibility",
    label: "Check Device Compatibility",
    icon: "✅",
    prefill: "Check if my device meets LMX Content requirements.",
    category: "Device Requirements",
    difficulty: "beginner",
    estimatedMinutes: 10,
    analyticsLabel: "Check Device Compatibility",
    workflowFile: "knowledge/workflows/check-device-compatibility.md",
  },
  {
    id: "wf-005",
    slug: "schedule-campaign",
    label: "Schedule Campaign",
    icon: "📅",
    prefill: "Guide me through scheduling content for a campaign.",
    category: "Content Scheduling",
    difficulty: "beginner",
    estimatedMinutes: 10,
    analyticsLabel: "Schedule Campaign",
    workflowFile: "knowledge/workflows/schedule-campaign.md",
  },
  {
    id: "wf-006",
    slug: "programmatic-readiness-check",
    label: "Programmatic Readiness Check",
    icon: "📡",
    prefill: "Validate if this device is ready for VAST and Programmatic campaigns.",
    category: "Programmatic / VAST",
    difficulty: "intermediate",
    estimatedMinutes: 15,
    analyticsLabel: "Programmatic Readiness Check",
    workflowFile: "knowledge/workflows/programmatic-readiness-check.md",
  },
  {
    id: "wf-007",
    slug: "content-deployment-checklist",
    label: "Content Deployment Checklist",
    icon: "📋",
    prefill: "Provide the deployment checklist before publishing content.",
    category: "Content Deployment",
    difficulty: "beginner",
    estimatedMinutes: 5,
    analyticsLabel: "Content Deployment Checklist",
    workflowFile: "knowledge/workflows/content-deployment-checklist.md",
  },
  {
    id: "wf-008",
    slug: "generate-support-checklist",
    label: "Generate Support Checklist",
    icon: "🎫",
    prefill: "What information should I collect before escalating a support ticket?",
    category: "Support Escalation",
    difficulty: "beginner",
    estimatedMinutes: 5,
    analyticsLabel: "Generate Support Checklist",
    workflowFile: "knowledge/workflows/generate-support-checklist.md",
  },
] as const;
