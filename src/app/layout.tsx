import type { Metadata } from "next";

import "normalize.css";
import "./globals.css";
import { fontAlumniSans } from "./_/utils/fonts";

export const metadata: Metadata = {
  title: "WeHere",
  description:
    "Là dự án do Thư viện Dương Liễu sáng lập, nhằm chia sẻ kiến thức về tâm lý cho tuổi vị thành niên.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fontAlumniSans.variable}>{children}</body>
    </html>
  );
}
