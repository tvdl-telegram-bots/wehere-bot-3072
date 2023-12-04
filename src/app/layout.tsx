import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@picocss/pico";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}
