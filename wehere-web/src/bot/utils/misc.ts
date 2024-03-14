import type { Message } from "grammy/types";

export function isMessagePlainText(msg: Message): boolean {
  return !!msg.text && msg.text.length <= 2048 && !msg.entities?.length;
}
