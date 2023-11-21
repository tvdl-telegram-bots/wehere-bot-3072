import { getRole } from "../operations/admin";
import { getAdminName, getAngelName } from "../operations/angel";
import { toChatIsh } from "../operations/mortal";
import { Command } from "../types";
import { nonNullable } from "../utils/assert";
import { withDefaultErrorHandler } from "../utils/error";
import html from "../utils/html";

const handler = withDefaultErrorHandler(async (ctx) => {
  const chatId = nonNullable(ctx.chat?.id);
  const fromId = nonNullable(ctx.from?.id);
  const role = await getRole(ctx.db, fromId);

  switch (role) {
    case "admin": {
      await ctx.api.sendMessage(
        chatId,
        [
          ctx.t("html-welcome-admin", {
            name: html.strong(html.literal(await getAdminName(ctx.db, fromId))),
          }),
          "",
          html.strong(ctx.t("html-available-commands")),
          "- /start",
          "- /get_role",
          "- /set_role",
          "- /connect",
          "- /disconnect",
          "- /subscribe",
          "- /unsubscribe",
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      break;
    }

    case "angel": {
      await ctx.api.sendMessage(
        chatId,
        [
          ctx.t("html-welcome-angel", {
            name: html.strong(html.literal(await getAngelName(ctx.db, fromId))),
          }),
          "",
          html.strong(ctx.t("html-available-commands")),
          "- /connect",
          "- /disconnect",
          "- /subscribe",
          "- /unsubscribe",
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      break;
    }

    case "mortal": {
      await ctx.api.sendMessage(
        chatId,
        [
          ctx.t("html-welcome-mortal", {
            name: html.strong(html.literal(toChatIsh(chatId))),
          }),
        ].join("\n"),
        { parse_mode: "HTML" }
      );
      break;
    }
  }
});

const Start: Command = {
  commandName: "start",
  handler,
};

export default Start;
