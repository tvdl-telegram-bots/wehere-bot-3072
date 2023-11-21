import { getBot } from "../src/bot/getBot";
import { ENV, FTL } from "../src/env/node";

async function main() {
  const bot = await getBot({ env: ENV, ftl: FTL });
  await bot.start();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
