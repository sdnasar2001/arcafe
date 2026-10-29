import type { Metadata } from "next";
import { Anek_Tamil, Mukta_Malar } from "next/font/google";
import "./globals.css";

// Display face (English and Tamil) and body face, exposed as CSS variables for tokens.css.
const anek = Anek_Tamil({ subsets: ["latin", "tamil"], axes: ["wdth"], variable: "--font-anek", display: "swap" });
const mukta = Mukta_Malar({ subsets: ["latin", "tamil"], weight: ["400", "700"], variable: "--font-mukta", display: "swap" });

export const metadata: Metadata = {
  title: "AR Cafe",
  description: "Tea, coffee, tiffin and bakery on Revu Main Road, Parangi Pettai.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anek.variable} ${mukta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
