import type { MetadataRoute } from "next";
import { seo } from "@/content/brand";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin/" }],
    sitemap: seo.siteUrl + "/sitemap.xml",
  };
}
