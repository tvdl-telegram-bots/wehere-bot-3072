import ftl_en from "@/resources/locales/en.ftl";
import ftl_vi from "@/resources/locales/vi.ftl";
import { Env, Ftl } from "@/typing";

export const ENV = Env.parse({
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  MONGODB_URI:
    process.env.MONGODB_URI ||
    decodeURIComponent(process.env.MONGODB_URI__URLENCODED || ""),
  MONGODB_DBNAME: process.env.MONGODB_DBNAME,
  RESOURCE_DIR: process.env.RESOURCE_DIR,
});

export const FTL = Ftl.parse({
  en: ftl_en,
  vi: ftl_vi,
});
