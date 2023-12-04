import { ObjectId } from "mongodb";
import { z } from "zod";

import PageThread from "@/app/_/containers/PageThread";

export default async function Route({
  params,
}: {
  params: Record<string, unknown>;
}) {
  return (
    <PageThread
      threadId={z.string().parse(params.tid)}
      origin={ObjectId.createFromTime(Date.now() / 1000).toHexString()}
    />
  );
}
