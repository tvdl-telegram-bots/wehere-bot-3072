import { notFound } from "next/navigation";
import type { PrismaModule } from "wehere-cms/context";
import { keystoneContext } from "wehere-cms/context";

import PagePost from "../_/containers/PagePost";

import type { ImageHandle } from "@/typing/common";

const ALLOWED_HEADS = ["info", "blog"];

async function findOnePost({
  name,
  parent,
}: {
  name: string;
  parent: PrismaModule.Post | null;
}): Promise<PrismaModule.Post | null> {
  const posts = await keystoneContext.db.Post.findMany({
    where: {
      name: { equals: name },
      parent: parent ? { id: { equals: parent.id } } : null,
    },
    orderBy: { id: "desc" },
    take: 1,
  });
  return posts[0] || null;
}

async function resolvePost(
  segments: string[]
): Promise<PrismaModule.Post | null> {
  if (!ALLOWED_HEADS.includes(segments[0])) return null;
  let currentPost: PrismaModule.Post | null = null;
  for (const s of segments) {
    currentPost = await findOnePost({ name: s, parent: currentPost });
    if (!currentPost) return null;
  }
  return currentPost;
}

export default async function Route({
  params,
}: {
  params: { segments: string[] };
}) {
  const post = await resolvePost(params.segments);
  if (!post) return notFound();

  let heroImage: ImageHandle | null = null;
  if (
    post.heroImage_id != null &&
    post.heroImage_extension != null &&
    post.heroImage_filesize != null &&
    post.heroImage_height != null &&
    post.heroImage_width != null
  ) {
    const heroImageUrl = await keystoneContext
      .images("arn:aws:s3:::wehere-bot-storage")
      .getUrl(post.heroImage_id, post.heroImage_extension as any);
    heroImage = {
      id: post.heroImage_id,
      extension: post.heroImage_extension,
      filesize: post.heroImage_filesize,
      height: post.heroImage_height,
      width: post.heroImage_width,
      url: heroImageUrl,
    };
  }

  return <PagePost post={post} heroImage={heroImage} />;
}
