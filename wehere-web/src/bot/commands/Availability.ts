import { InlineKeyboard } from "grammy";
import { z } from "zod";

import { getAvailability } from "../operations/getAvailability";
import { getChatLocale } from "../operations/getChatLocale";
import { getRole } from "../operations/getRole";
import { setAvailability } from "../operations/setAvailability";
import { withDefaultErrorHandler } from "../utils/error";
import { parseCallbackQueryData } from "../utils/parse";

import type { Command } from "@/types";
import { assert, nonNullable } from "@/utils/assert";

const handleMessage = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.message);
  const role = await getRole(ctx, msg0.from.id);
  const locale = await getChatLocale(ctx, msg0.chat.id);

  if (role === "mortal") {
    ctx.api.sendMessage(
      msg0.chat.id,
      ctx.withLocale(locale)("html-forbidden"),
      { parse_mode: "HTML" }
    );
    return;
  }

  assert(["angel", "admin"].includes(role), "forbidden");
  const availability = await getAvailability(ctx);
  const messageBody = availability.value
    ? ctx.withLocale(locale)("html-we-are-available")
    : ctx.withLocale(locale)("html-we-are-unavailable");

  await ctx.api.sendMessage(msg0.chat.id, messageBody, {
    parse_mode: "HTML",
    reply_markup: new InlineKeyboard()
      .text(
        ctx.withLocale(locale)("html-set-available"),
        "wehere:/availability?value=true"
      )
      .text(
        ctx.withLocale(locale)("html-set-unavailable"),
        "wehere:/availability?value=false"
      ),
  });
});

const Params = z.object({
  value: z.enum(["true", "false"]).transform((value) => value === "true"),
});

const handleCallbackQuery = withDefaultErrorHandler(async (ctx) => {
  const msg0 = nonNullable(ctx.callbackQuery?.message);
  const data = nonNullable(ctx.callbackQuery?.data);
  const { query } = parseCallbackQueryData(data);
  const locale = await getChatLocale(ctx, msg0.chat.id);
  const params = Params.parse(query);
  await setAvailability(ctx, { value: params.value });

  const messageBody = params.value
    ? ctx.withLocale(locale)("html-we-are-available")
    : ctx.withLocale(locale)("html-we-are-unavailable");
  await ctx.api.sendMessage(
    msg0.chat.id, //
    messageBody,
    { parse_mode: "HTML" }
  );
});

const Availability = {
  commandName: "availability",
  handleMessage,
  handleCallbackQuery,
} satisfies Command;

export default Availability;
