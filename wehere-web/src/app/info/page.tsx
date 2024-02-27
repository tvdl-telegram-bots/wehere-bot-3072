import { keystoneContext } from "wehere-cms/context";

import PageInfo from "../_/containers/PageInfo";

export default async function Route() {
  const posts = await keystoneContext.db.Post.findMany();

  console.log(posts);

  return <PageInfo />;
}
