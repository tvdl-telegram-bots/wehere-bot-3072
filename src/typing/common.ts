import { z } from "zod";

export const Env = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  MONGODB_URI: z.string().startsWith("mongodb"),
  MONGODB_DBNAME: z.string().min(1),
});

export type Env = z.infer<typeof Env>;

export const Ftl = z.object({
  en: z.string(),
  vi: z.string(),
});

export type Ftl = z.infer<typeof Ftl>;

/** @deprecated use UserId instead */
export const UserIsh = z.string().min(1);
export type UserIsh = z.infer<typeof UserIsh>;

export const UserId = z.coerce.number().int().safe();
export type UserId = z.infer<typeof UserId>;

export const Timestamp = z.coerce.number().int().safe();
export type Timestamp = z.infer<typeof Timestamp>;

export const ChatId = z.coerce.number().int().safe();
export type ChatId = z.infer<typeof UserId>;

export const MessageId = z.coerce.number().int().safe();
export type MessageId = z.infer<typeof UserId>;

export const MessageDirection = z.enum(["from_mortal", "from_angel"]);
export type MessageDirection = z.infer<typeof MessageDirection>;

export const Role = z.enum(["mortal", "angel", "admin"]);
export type Role = z.infer<typeof Role>;

// TODO: move to typing/server.ts
export const PersistentRole = z.object({
  userId: UserId,
  role: Role.nullish(),
  updatedAt: Timestamp.nullish(),
  updatedBy: UserId.nullish(),
});

export type PersistentRole = z.infer<typeof PersistentRole>;

export const Locale = z.enum(["en", "vi"]);
export type Locale = z.infer<typeof Locale>;
