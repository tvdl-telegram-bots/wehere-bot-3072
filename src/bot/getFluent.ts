import { Fluent } from "@moebius/fluent";

import { Ftl } from "@/typing";

export async function getFluent(ftl: Ftl) {
  const fluent = new Fluent();

  await fluent.addTranslation({
    locales: "en",
    source: ftl.en,
    bundleOptions: { useIsolating: false },
  });

  await fluent.addTranslation({
    locales: "vi",
    source: ftl.vi,
    bundleOptions: { useIsolating: false },
  });

  return fluent;
}
