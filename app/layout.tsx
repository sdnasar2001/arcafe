import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/inter";
import "./globals.css";
import { seo } from "@/content/brand";
import { BASE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl + "/"),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    url: "./",
    siteName: "AR Cafe",
    title: seo.title,
    description: seo.description,
    locale: "en_IN",
    images: [{ url: BASE + "/og.png", width: 1200, height: 630, alt: "AR Cafe — Crafted for the craving" }],
  },
  twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [BASE + "/og.png"] },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
