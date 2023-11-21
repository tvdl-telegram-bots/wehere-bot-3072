import { z } from "zod";

export const Env = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  MONGODB_URI: z.string().startsWith("mongodb"),
  MONGODB_DBNAME: z.string().min(1),
  RESOURCE_DIR: z.string().min(1),
});

export type Env = z.infer<typeof Env>;

export const Ftl = z.object({
  en: z.string(),
  vi: z.string(),
});

export type Ftl = z.infer<typeof Ftl>;

export const UserIsh = z.string().min(1);
export type UserIsh = z.infer<typeof UserIsh>;

export const UserId = z.coerce.number().int().safe();
export type UserId = z.infer<typeof UserId>;

export const Timestamp = z.coerce.number().int().safe();
export type Timestamp = z.infer<typeof Timestamp>;

export const ChatId = z.coerce.number().int().safe();
export type ChatId = z.infer<typeof UserId>;

export const Role = z.enum(["mortal", "angel", "admin"]);
export type Role = z.infer<typeof Role>;

export const PersistentRole = z.object({
  userId: UserId,
  role: Role.nullish(),
  updatedAt: Timestamp.nullish(),
  updatedBy: UserId.nullish(),
});

export type PersistentRole = z.infer<typeof PersistentRole>;

export const PersistentMessage = z.object({
  mortalChatId: ChatId,
  fromRole: Role,
  createdBy: UserId.nullish(),
  createdAt: Timestamp.nullish(),
});

export type PersistentMessage = z.infer<typeof PersistentMessage>;

export const PersistentSubscription = z.object({
  chatId: ChatId,
  enabled: z.boolean().nullish(),
  updatedAt: Timestamp.nullish(),
  updatedBy: UserId.nullish(),
});

export type PersistentSubscription = z.infer<typeof PersistentSubscription>;

export const PersistentConnection = z.object({
  angelChatId: ChatId,
  mortalChatId: ChatId.nullish(),
  updatedBy: UserId.nullish(),
  updatedAt: Timestamp.nullish(),
});

export type PersistentConnection = z.infer<typeof PersistentConnection>;
