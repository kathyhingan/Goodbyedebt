import type { MetadataRoute } from "next";
import { ARTICLE_LIST } from "@/lib/content/articles";

const BASE_URL = "https://www.almostdebtfree.com";

export const dynamic = "static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const articleRoutes: MetadataRoute.Sitemap = ARTICLE_LIST.map((a) => ({
    url: `${BASE_URL}/guides/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...articleRoutes];
}
