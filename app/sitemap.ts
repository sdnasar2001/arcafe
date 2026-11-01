import type { MetadataRoute } from "next";
import { seo } from "@/content/brand";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: seo.siteUrl + "/", changeFrequency: "weekly", priority: 1 }];
}
