export type ChatSource = "openai" | "knowledge" | "local" | "claude" | "mistral";

export type SourceNote = { file: string; folder: string; heading: string };

export type SourceLink = { label: string; url: string };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: ChatSource;
  sourceLinks?: SourceLink[];
  sourceNotes?: SourceNote[];
};

export type ChatAttachment = {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
  text?: string;
};
