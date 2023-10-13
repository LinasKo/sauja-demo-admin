////////////////////////////////////////////////////////////
// Agent Chat - Core
////////////////////////////////////////////////////////////

/**
 * What kind of a message is this?
 *
 * Does not include agent prompts.
 * There's many agents, and prompts are applied repeatedly.
 * Should be visible in token counters and shown by querying the DB.
 */
export enum MessageType {
  USER = "user",
  AGENT = "agent",
  SUMMARIZER = "summary",
  INTERRUPTED = "interrupted",
  CART_STATUS = "cart_status",
  MEMORY = "memory",
}

/** Who's using the site? */
export enum UserType {
  LOCAL = "local", // localhost
  DEV = "dev", // has dev key
  USER = "user", // accesses via allowed site
  UNKNOWN = "unknown", // unknown (wtf?)
}

/** How was message content created */
export enum InputType {
  TYPED = "typed",
  SPEECH_TO_TEXT = "speech_to_text",
  AI_GENERATED = "ai_generated",
}

export enum Platform {
  WEB = "web",
  MOBILE = "mobile",
  BACKEND = "backend",
  UNKNOWN = "unknown",
}

export type Prompt = {
  id: string;
  text: string;
  model: string;
};

export type Chat = {
  id: string;
  promptId: string;
  userId: string;
  urlPath: string;
  userType: string;
  platform: string;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
};

// Full message, but with 2 extra fields
export type Message = {
  id: string;
  chatId: string;
  type: string;
  content: string;
  templateId: string | null;
  cacheHit: boolean | null;
  inputType: string;
  wasInterrupted: boolean | null;
  isBeingWritten: boolean | null;
  platform: string;
  tokenCount: number;
  tokenInputUsed: number;
  tokenOutputUsed: number;
  timeReceived: string;
  timeResponded: string;
};
