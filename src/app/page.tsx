import { cookies } from "next/headers";
import { unstable_serialize } from "swr";

import PageHome from "./_/containers/PageHome";
import { run$ReadSessionState } from "./api/ReadSessionState/handler";

import { SWRConfig } from "@/app/_/components/SWRConfig";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = cookies();

  const result$ReadSessionState = await run$ReadSessionState({
    reqCookies: cookieStore,
  });

  return (
    <SWRConfig
      value={{
        fallback: {
          [unstable_serialize({ path: "/api/ReadSessionState", params: {} })]:
            result$ReadSessionState,
        },
      }}
    >
      <PageHome />
    </SWRConfig>
  );
}
