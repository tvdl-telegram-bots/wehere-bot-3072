import type { Db, WithoutId } from "mongodb";

import type { ChatId, ThreadPlatform } from "@/typing/common";
import type { PersistentObjectId } from "@/typing/server";
import {
  PersistentMortalSubscription,
  PersistentThread,
} from "@/typing/server";

const EMOJIS = `
  🐵 🐒 🦍 🦧 🐶 🐕 🦮 🐕‍🦺 🐩 🐺 🦊 🦝 🐱 🐈 🐈‍⬛ 🦁 🐯 🐅 🐆 🐴
  🐎 🦄 🦓 🦌 🦬 🐮 🐄 🐂 🐃 🐷 🐖 🐗 🐽 🐏 🐑 🐐 🐪 🐫 🦙 🦒
  🐘 🦣 🦏 🦛 🐭 🐁 🐀 🐹 🐰 🐇 🐿 🦫 🦔 🦇 🐻 🐻‍❄️ 🐨 🐼 🦥 🦦
  🦨 🦘 🦡 🐾 🦃 🐔 🐓 🐣 🐤 🐥 🐦 🐦‍⬛ 🐧 🕊 🦅 🦆 🦢 🦉 🦤 🪶
  🦩 🦜 🐸 🐊 🐢 🦎 🐍 🐲 🐉 🦕 🦖 🐳 🐋 🐬 🦭 🐟 🐠 🐡 🦈 🐙
  🐚 🐌 🦋 🐛 🐜 🐝 🪲 🐞 🦗 🪳 🕷 🕸 🦂 🦟 🪰 🪱 🦠 💐 🌸 💮
  🏵 🌹 🥀 🌺 🌻 🌼 🌷 🌱 🪴 🌲 🌳 🌴 🌵 🌾 🌿 ☘ 🍀 🍁 🍂 🍃
  🪹 🪺 🍇 🍈 🍉 🍊 🍋 🍌 🍍 🥭 🍎 🍏 🍐 🍑 🍒 🍓 🫐 🥝 🍅 🫒
  🥥 🥑 🍆 🥔 🥕 🌽 🌶 🫑 🥒 🥬 🥦 🧄 🧅 🍄 🥜 🫑 🌰 🍞 🥐 🥖
  🫓 🥨 🥯 🥞 🧇 🧀 🍖 🍗 🥩 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🫔 🥙 🧆
  🥚 🍳 🥘 🍲 🫕 🥣 🥗 🍿 🧈 🧂 🥫 🍱 🍘 🍙 🍚 🍛 🍜 🍝 🍠 🍢
  🍣 🍤 🍥 🥮 🍡 🥟 🥠 🥡 🦀 🦞 🦐 🦑 🦪 🍨 🍧 🍦 🍩 🍪 🎂 🍰
  🧁 🥧 🍫 🍬 🍭 🍮 🍯 🍼 🥛 ☕ 🫖 🍵 🍶 🍾 🍷 🍸 🍹 🍺 🍻 🥂
  🥃 🥤 🧋 🧃 🧉 🧊 🥢 🍽 🍴 🥄 🔪 🧋 🏺`
  .trim()
  .split(/\s+/);

const LAST_NAMES = `
Abe     Adachi  Agawa   Aida    Aikawa  Aino    Akai    Akao
Akashi  Akeda   Akita   Amaki   Amano   Amo     Anami   Aoyama
Arai    Araki   Arata   Arii    Arioka  Arita   Asada   Asano
Ashida  Ayano   Baba    Bai     Banba   Bandai  Beppu   Chano
Daichi  Daicho  Daido   Daijo   Daiku   Daiwa   Daiyo   Dan
Date    Deon    Deura   Deushi  Deyama  Dezaki  Dokite  Eki
Eku     Eto     Ezura   Fukuda  Gaiato  Ganbe   Gobu    Godai
Goto    Guionu  Hagino  Hakuta  Haneda  Haruno  Hasemi  Hatano
Hibino  Hidaka  Hirai   Hirano  Hirota  Honda   Honma   Horie
Horii   Ide     Igawa   Iguchi  Iida    Ikeda   Imoto   Inaba
Inada   Inoue   Inukai  Ioki    Ishida  Ishii   Ishiki  Isobe
Isono   Iwai    Iwaki   Jihara  Jinmei  Jinnai  Jogo    Junpei
Kagura  Kaiba   Kaito   Kaku    Kamiya  Kanai   Kanan   Kaneda
Kanno   Kasuga  Katono  Kayano  Kimoto  Kimura  Kitani  Kitano
Kobe    Koda    Kogo    Koike   Koiwai  Kokaji  Komiya  Konami
Kondo   Konno   Kosaka  Koyama  Kume    Kumiko  Kumode  Kumon
Kuraya  Kurita  Kuroi   Kuroki  Kurono  Maaka   Maeda   Mamiya
Matsui  Mazaki  Meichi  Mihama  Miki    Mineto  Miura   Miyagi
Monden  Morita  Myoui   Nagai   Nagata  Nagato  Naito   Nakano
Nara    Nezu    Niimi   Nitta   Noda    Nogami  Nomura  Nozawa
Obara   Obata   Ochiai  Oda     Ode     Ogata   Ogawa   Oguri
Oguro   Oide    Oikawa  Oishi   Okabe   Okada   Okano   Okubo
Okuda   Omi     Omura   Onishi  Onouye  Orido   Oshii   Oshima
Otake   Otsuka  Oyama   Reizei  Rokuda  Royama  Sada    Sagara
Sage    Sakata  Sannai  Sano    Sanuki  Seino   Senda   Seriou
Seta    Seto    Shida   Shinjo  Shoji   Shutou  Sonoda  Sudo
Sugo    Suwa    Taira   Takada  Takagi  Takano  Takasu  Takeda
Takei   Tamiya  Tamura  Tebi    Terada  Tezuka  Tomada  Toyoda
Tsuda   Tsuji   Ubagai  Ubai    Uchino  Ueda    Ueno    Uenuma
Ueo     Uesugi  Umetsu  Uno     Uotani  Usuda   Usui    Utsubo
Uyama   Wada    Waki    Watabe  Watoga  Wauke   Yabuki  Yada
Yagami  Yajima  Yamada  Yamane  Yamato  Yanagi  Yanase  Yano
Yasuda  Yatabe  Yofu    Yomoda  Yoneda  Yoshii  Yuito   Zaan
Zeniya`
  .trim()
  .split(/\s+/);

export function generateThreadName() {
  const lastNameAt = Math.floor(Math.random() * LAST_NAMES.length);
  const number = Date.now().toString().slice(-2);
  return LAST_NAMES[lastNameAt] + number;
}

export function generateThreadEmoji() {
  const emojiAt = Math.floor(Math.random() * EMOJIS.length);
  return EMOJIS[emojiAt];
}

export async function createThread(
  ctx: { db: Db },
  params: { platform: ThreadPlatform }
): Promise<PersistentThread> {
  const thread: WithoutId<PersistentThread> = {
    name: generateThreadName(),
    emoji: generateThreadEmoji(),
    createdAt: Date.now(),
    platform: params.platform,
  };

  const ack = await ctx.db.collection("thread").insertOne(thread);
  return { _id: ack.insertedId, ...thread };
}

export async function queryThread_givenMortalChatId(
  { db }: { db: Db },
  chatId: ChatId
) {
  // Given the `chatId`, find the `threadId`
  const threadId = await db
    .collection("mortal_subscription")
    .findOne({ chatId })
    .then((doc) => PersistentMortalSubscription.parse(doc))
    .then((sub) => sub.threadId)
    .catch(() => undefined);
  if (!threadId) return undefined;

  // Given the `threadId`, find the `thread`
  const thread = await db
    .collection("thread")
    .findOne({ _id: threadId })
    .then((doc) => PersistentThread.parse(doc))
    .catch(() => undefined);
  return thread;
}

export async function updateMortalSubscription(
  ctx: { db: Db },
  params: { chatId: ChatId; threadId: PersistentObjectId }
) {
  await ctx.db.collection("mortal_subscription").updateOne(
    { chatId: params.chatId },
    {
      $set: {
        threadId: params.threadId,
        updatedAt: Date.now(),
      } satisfies Partial<PersistentMortalSubscription>,
    },
    { upsert: true }
  );
}

/**
 * Retrieves a thread from the mortal chat ID.
 * If the thread exists, it is returned.
 * If the thread does not exist, a new thread is created, subscribed, and returned.
 */
export async function getThread_givenMortalChatId(
  ctx: { db: Db },
  chatId: ChatId
) {
  // Find the thread given `chatId`. If exists, return.
  const existingThread = await queryThread_givenMortalChatId(ctx, chatId);
  if (existingThread) return existingThread;

  // If not exists, create a new thread, subscribe, and return.
  const newThread = await createThread(ctx, { platform: "telegram" });
  await updateMortalSubscription(ctx, { chatId, threadId: newThread._id });
  return newThread;
}

export async function getThread_givenThreadId(
  ctx: { db: Db },
  threadId: PersistentObjectId
) {
  return await ctx.db
    .collection("thread")
    .findOne(threadId)
    .then((doc) => PersistentThread.parse(doc))
    .catch(() => undefined);
}
