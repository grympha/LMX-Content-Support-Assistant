import { pgTable, uuid, varchar, text, timestamp, numeric, integer, index } from "drizzle-orm/pg-core";

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  title: varchar("title", { length: 500 }).notNull().default("New Conversation"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const trainingEvents = pgTable(
  "training_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventType: varchar("event_type", { length: 50 }).notNull(),
    username: varchar("username", { length: 255 }).notNull().default(""),
    fullName: varchar("full_name", { length: 500 }),
    topic: varchar("topic", { length: 500 }),
    question: text("question"),
    progressPercent: numeric("progress_percent", { precision: 5, scale: 2 }),
    completedTopics: text("completed_topics").array(),
    source: varchar("source", { length: 255 }),
    details: text("details"),
    loggedAt: timestamp("logged_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_training_events_username").on(t.username),
    index("idx_training_events_logged_at").on(t.loggedAt),
    index("idx_training_events_type_time").on(t.eventType, t.loggedAt),
    index("idx_training_events_user_type").on(t.username, t.eventType),
  ]
);

export const userProgress = pgTable(
  "user_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 500 }),
    completedTopics: text("completed_topics").array().notNull().default([]),
    progressPercent: numeric("progress_percent", { precision: 5, scale: 2 })
      .notNull()
      .default("0"),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type TrainingEvent = typeof trainingEvents.$inferSelect;
export type NewTrainingEvent = typeof trainingEvents.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;

export const assistantFeedback = pgTable(
  "assistant_feedback",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", { length: 255 }).notNull(),
    conversationId: uuid("conversation_id").references(() => conversations.id, { onDelete: "set null" }),
    messageId: uuid("message_id"),
    question: text("question"),
    response: text("response"),
    rating: varchar("rating", { length: 20 }).notNull(),
    aiProvider: varchar("ai_provider", { length: 50 }),
    sources: text("sources").array(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("idx_assistant_feedback_username").on(t.username),
    index("idx_assistant_feedback_rating").on(t.rating),
    index("idx_assistant_feedback_created_at").on(t.createdAt),
    index("idx_assistant_feedback_conversation_id").on(t.conversationId),
  ]
);

export type AssistantFeedback = typeof assistantFeedback.$inferSelect;
export type NewAssistantFeedback = typeof assistantFeedback.$inferInsert;

export const learnedAnswers = pgTable(
  "learned_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    normalizedQuestion: text("normalized_question").notNull().unique(),
    originalQuestion: text("original_question").notNull(),
    response: text("response").notNull(),
    feedbackId: uuid("feedback_id").references(() => assistantFeedback.id, { onDelete: "set null" }),
    approvedBy: varchar("approved_by", { length: 255 }),
    status: varchar("status", { length: 20 }).notNull().default("candidate"),
    reusedCount: integer("reused_count").notNull().default(0),
    username: varchar("username", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
  },
  (t) => [
    index("idx_learned_answers_status").on(t.status),
    index("idx_learned_answers_created_at").on(t.createdAt),
  ]
);

export type LearnedAnswer = typeof learnedAnswers.$inferSelect;
export type NewLearnedAnswer = typeof learnedAnswers.$inferInsert;
