import { Db, WithoutId } from "mongodb";

import { ChatId } from "../../../typing/common";

import {
  PersistentMortalSubscription,
  PersistentThread,
  PersistentThreadMessage,
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

const FIRST_NAMES = `
  Aguri   Akemi   Akiho   Akimi   Akira   Anri    Aoi     Asuka
  Ataru   Chiaki  Fuku    Fumiyo  Hajime  Haruka  Harumi  Hatsu
  Hayate  Hibiki  Hide    Hifumi  Hikari  Hikaru  Hiromi  Hiromu
  Hisaya  Hotaru  Ibara   Ibuki   Iori    Isami   Itsuki  Jun
  Kaede   Kagami  Kairi   Kakeru  Kamui   Kaname  Kanata  Kaoru
  Kayo    Kazumi  Keiki   Kirara  Kohaku  Kokoro  Kou     Kumi
  Kunie   Kurumi  Kyo     Maki    Makoto  Manami  Masaki  Masami
  Masumi  Matoi   Mikoto  Minato  Minori  Mirai   Misao   Mitsue
  Mizuho  Mizuki  Mukuro  Nagisa  Naomi   Natsuo  Oboro   Rei
  Ren     Reon    Retsu   Riku    Rio     Rui     Ryuko   Sakae
  Sakuya  Satori  Shiki   Shima   Shion   Shizu   Sora    Taiga
  Takami  Takemi  Tamaki  Terumi  Tomoe   Tomomi  Tomori  Tori
  Toru    Towa    Toyo    Yakumo  Yoshie  Yuki    Yuma`
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

export function toChatIsh(chatId: ChatId) {
  let remainder = chatId;
  const emojiIndex = remainder % EMOJIS.length;
  remainder = Math.floor(remainder / EMOJIS.length);
  const firstNameIndex = remainder % FIRST_NAMES.length;
  remainder = Math.floor(remainder / FIRST_NAMES.length);
  const lastNameIndex = remainder % LAST_NAMES.length;
  remainder = Math.floor(remainder / LAST_NAMES.length);
  const number = remainder ^ emojiIndex ^ firstNameIndex ^ lastNameIndex;
  return [
    EMOJIS[emojiIndex],
    " ",
    FIRST_NAMES[firstNameIndex],
    LAST_NAMES[lastNameIndex],
    number,
  ].join("");
}

const TOKEN_REGEX =
  /[A-Z][a-z]{1,5}|[0-9]+|(?:[\u2000-\u3300]|[\ud83c-\ud83e][\ud000-\udfff])/g;

export function fromChatIsh(chatIsh: string): ChatId | undefined {
  const matches = chatIsh.match(TOKEN_REGEX);
  if (!matches || matches.length !== 4) return undefined;
  const emojiIndex = EMOJIS.indexOf(matches[0]);
  const firstNameIndex = FIRST_NAMES.indexOf(matches[1]);
  const lastNameIndex = LAST_NAMES.indexOf(matches[2]);
  const number = parseInt(matches[3]);

  if (
    emojiIndex < 0 ||
    firstNameIndex < 0 ||
    lastNameIndex < 0 ||
    !isFinite(number)
  ) {
    return undefined;
  }

  let remainder = number ^ emojiIndex ^ firstNameIndex ^ lastNameIndex;
  remainder = remainder * LAST_NAMES.length + lastNameIndex;
  remainder = remainder * FIRST_NAMES.length + firstNameIndex;
  remainder = remainder * EMOJIS.length + emojiIndex;
  return remainder;
}

export function generateThreadName() {
  const lastNameAt = Math.floor(Math.random() * LAST_NAMES.length);
  const number = Date.now().toString().slice(-2);
  return LAST_NAMES[lastNameAt] + number;
}

export function generateThreadEmoji() {
  const emojiAt = Math.floor(Math.random() * EMOJIS.length);
  return EMOJIS[emojiAt];
}

export async function getThreadFromMortalChatId(
  db: Db,
  { chatId }: { chatId: ChatId }
) {
  const now = Date.now();

  const existingMortalSub = await db
    .collection("mortal_subscription")
    .findOne({ chatId })
    .then((doc) => PersistentMortalSubscription.parse(doc))
    .catch(() => undefined);

  const existingThread = existingMortalSub?.threadId
    ? await db
        .collection("thread")
        .findOne({ _id: existingMortalSub.threadId })
        .then((doc) => PersistentThread.parse(doc))
        .catch(() => undefined)
    : undefined;

  if (existingThread) {
    return existingThread;
  }

  const { insertedId } = await db.collection("thread").insertOne({
    name: generateThreadName(),
    emoji: generateThreadEmoji(),
    createdAt: now,
  });

  const newThread = await db
    .collection("thread")
    .findOne({ _id: insertedId })
    .then((doc) => PersistentThread.parse(doc));

  await db.collection("mortal_subscription").updateOne(
    { chatId },
    {
      $set: {
        threadId: newThread._id,
        updatedAt: now,
      } satisfies Partial<PersistentMortalSubscription>,
    },
    { upsert: true }
  );

  return newThread;
}

export async function createMessage(
  db: Db,
  message: WithoutId<PersistentThreadMessage>
): Promise<PersistentThreadMessage> {
  const ack = await db.collection("thread_message").insertOne(message);
  return { _id: ack.insertedId, ...message };
}
