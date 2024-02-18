import { Alumni_Sans, Inter } from "next/font/google";

export const fontDisplay = Alumni_Sans({
  subsets: ["latin", "vietnamese"],
  weight: "variable",
  variable: "--font-display",
  display: "swap",
});

export const fontBody = Inter({
  subsets: ["latin", "vietnamese"],
  weight: "variable",
  variable: "--font-body",
  display: "swap",
});
