import "normalize.css";
import "./globals.css";

import cx from "clsx";
import { Metadata } from "next";

import { fontBody, fontDisplay } from "./_/utils/fonts";

import { CLIENT_ENV } from "@/env/next-client";

export const metadata: Metadata = {
  metadataBase: new URL(CLIENT_ENV.METADATA_BASE),
  title: "WeHere",
  description:
    "Dự án tâm lý do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức, câu chuyện, sự kiện về sức khỏe tinh thần của  trẻ vị thành niên.",
  openGraph: {
    title: "WeHere",
    description:
      "Dự án tâm lý do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức, câu chuyện, sự kiện về sức khỏe tinh thần của  trẻ vị thành niên.",
    siteName: "WeHere",
    images: [
      {
        url: "https://d33szaedamwhlg.cloudfront.net/blobs/65abe9facdda0d7a62c5d8f6",
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
