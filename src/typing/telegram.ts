import { z } from "zod";

export const User = z.object({
  id: z.number(),
  is_bot: z.boolean(),
  first_name: z.string(),
  last_name: z.string().nullish(), // optional field
  username: z.string().nullish(), // optional field
  language_code: z.string().nullish(), // optional field
  is_premium: z.boolean().nullish(), // optional field
  added_to_attachment_menu: z.boolean().nullish(), // optional field
});

export type User = z.infer<typeof User>;

const AbstractMessageEntity = z.object({
  type: z.string(),
  offset: z.number(),
  length: z.number(),
});

const CommonMessageEntity = AbstractMessageEntity.extend({
  type: z.enum([
    "mention",
    "hashtag",
    "cashtag",
    "bot_command",
    "url",
    "email",
    "phone_number",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "spoiler",
    "code",
  ]),
});

const PreMessageEntity = AbstractMessageEntity.extend({
  type: z.literal("pre"),
  language: z.string().optional(),
});

const TextLinkMessageEntity = AbstractMessageEntity.extend({
  type: z.literal("text_link"),
  url: z.string(),
});

const TextMentionMessageEntity = AbstractMessageEntity.extend({
  type: z.literal("text_mention"),
  user: User,
});

const CustomEmojiMessageEntity = AbstractMessageEntity.extend({
  type: z.literal("custom_emoji"),
  custom_emoji_id: z.string(),
});

export const MessageEntity = z.union([
  CommonMessageEntity,
  CustomEmojiMessageEntity,
  PreMessageEntity,
  TextLinkMessageEntity,
  TextMentionMessageEntity,
]);

export type MessageEntity = z.infer<typeof MessageEntity>;
