import "normalize.css";
import "./globals.css";

import cx from "clsx";
import type { Metadata } from "next";

import { fontBody, fontDisplay } from "./_/utils/fonts";

import { CLIENT_ENV } from "@/env/next-client";

export const metadata: Metadata = {
  metadataBase: new URL(CLIENT_ENV.METADATA_BASE),
  title: "WeHere",
  description:
    "Dự án tâm lý do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức, câu chuyện, sự kiện về sức khỏe tinh thần của người trẻ.",
  openGraph: {
    title: "WeHere",
    description:
      "Dự án tâm lý do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức, câu chuyện, sự kiện về sức khỏe tinh thần của người trẻ.",
    siteName: "WeHere",
    images: [
      {
        url: "https://d33szaedamwhlg.cloudfront.net/blobs/65faed3fb7ee0f14666fe390",
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={cx(fontBody.variable, fontDisplay.variable)}
        data-VERCEL_URL={process.env.VERCEL_URL}
      >
        {children}
      </body>
    </html>
  );
}
