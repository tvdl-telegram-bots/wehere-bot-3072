import { zip } from "../../utils/array";

import { ThreadMessage } from "@/app/api/GetThreadMessages/typing";
import * as Telegram from "@/typing/telegram";

type Segment = {
  offset: number;
  length: number;
};

export type EntityPartition = {
  text: string;
  entities: Telegram.MessageEntity[];
};

export function getEntityPartitions(message: ThreadMessage): EntityPartition[] {
  if (!message.text) return [];
  const messageText = message.text;
  const messageEntities = message.entities || [];

  const endpoints: number[] = [
    ...[0, messageText.length],
    ...messageEntities.map((entity) => entity.offset),
    ...messageEntities.map((entity) => entity.offset + entity.length),
  ].sort((a, b) => a - b);

  const segments: Segment[] = !messageText
    ? [{ offset: 0, length: 0 }]
    : zip(endpoints, endpoints.slice(1))
        .map(([x, y]) => ({ offset: x, length: y - x }))
        .filter((item) => item.length > 0);

  const partitions: EntityPartition[] = segments.map(({ offset, length }) => ({
    text: messageText.slice(offset, offset + length),
    entities: messageEntities.filter(
      (entity) =>
        entity.offset >= offset &&
        entity.offset + entity.length <= offset + length
    ),
  }));

  return partitions;
}

export function getUrlScheme(text: string): string | undefined {
  try {
    const url = new URL(text);
    return url.protocol;
  } catch {
    return undefined;
  }
}

export function renderLink(url: string, content: React.ReactNode) {
  const scheme = getUrlScheme(url);
  if (["http:", "https:", "tg:"].includes(scheme || "")) {
    return (
      <a href={url} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  } else {
    return <u title={url}>{content}</u>;
  }
}

export function renderPartition(
  ptn: EntityPartition
): NonNullable<React.ReactNode> {
  if (!ptn.entities.length) return ptn.text;
  const [entity, ...otherEntities] = ptn.entities;

  const content = renderPartition({
    text: ptn.text,
    entities: otherEntities,
  });

  // https://core.telegram.org/bots/api#html-style
  switch (entity.type) {
    case "bold":
      return <b>{content}</b>;
    case "italic":
      return <i>{content}</i>;
    case "underline":
      return <u>{content}</u>;
    case "strikethrough":
      return <s>{content}</s>;
    case "code":
      return <code>{content}</code>;
    case "url":
      return renderLink(ptn.text, content);
    case "mention":
      return renderLink(`tg://resolve?domain=${ptn.text}`, content);
    case "pre":
      return <pre>{content}</pre>;
    case "text_link":
      return renderLink(entity.url, content);
    case "text_mention":
      return renderLink(`tg://user?id=${entity.user.id}`, content);
    case "custom_emoji":
      return (
        <span data-custom-emoji-id={entity.custom_emoji_id}>{content}</span>
      );
    default:
      return <u>{content}</u>;
  }
}
