import { ObjectId } from "mongodb";

import PageChat from "../_/containers/PageChat";

export default async function Route() {
  return (
    <PageChat
      origin={ObjectId.createFromTime(Date.now() / 1000).toHexString()}
    />
  );
}
