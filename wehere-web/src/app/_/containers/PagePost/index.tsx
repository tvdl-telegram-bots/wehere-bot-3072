"use client";

import type { DocumentRendererProps } from "@keystone-6/document-renderer";
import { DocumentRenderer } from "@keystone-6/document-renderer";
import cx from "clsx";
import Image from "next/image";
import React from "react";
import type { PrismaModule } from "wehere-cms/context";

import AppShell from "../../components/AppShell";

import styles from "./index.module.scss";

import type { ImageHandle } from "@/typing/common";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  post: PrismaModule.Post;

  // TODO: let's use keystoneContext.graphql.run and codegen
  // to make it easier to work with the GraphQL API
  heroImage: ImageHandle | null;
};

const renderers: DocumentRendererProps["renderers"] = {};

export default function PagePost({ className, style, post, heroImage }: Props) {
  return (
    <AppShell.Root
      className={cx(styles.container, className)}
      style={style}
      // activePage=
    >
      <AppShell.Left />
      <AppShell.Top label={post.title} />
      <AppShell.Center>
        {heroImage ? (
          <Image
            className={styles.heroImage}
            src={heroImage.url}
            alt={post.title}
            width={heroImage.width}
            height={heroImage.height}
          />
        ) : null}
        <DocumentRenderer
          document={JSON.parse(post.content)}
          renderers={renderers}
        />
      </AppShell.Center>
    </AppShell.Root>
  );
}
