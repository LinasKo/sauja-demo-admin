export enum Author {
  AGENT = "agent",
  USER = "user",
  SYSTEM = "system",
}

/** What kind of user is using the site? */
export enum UserType {
  LOCAL = "local", // localhost
  DEV = "dev", // has dev key
  USER = "user", // accesses via allowed site
  UNKNOWN = "unknown", // unknown (wtf?)
}

export type Chat = {
  id: string;
  origin: string;
  promptId: string;
  timeCreated: string;
  userType: any;
};

export type Message = {
  id: string;
  chatId: string;
  content: string;
  author: Author;
  timeCreated: string;
};

export type Prompt = {
  id: string;
  text: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
};
