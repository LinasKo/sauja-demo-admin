export enum Author {
  AGENT = "agent",
  USER = "user",
  SYSTEM = "system",
}

export type Convo = {
  id: string;
  origin: string;
  promptId: string;
};

export type Message = {
  id: string;
  conversationId: string;
  content: string;
  author: Author;
};
