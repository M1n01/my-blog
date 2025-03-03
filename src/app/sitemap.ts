import type { MetadataRoute } from "next";
import { getNotionArticles } from "@/lib/notion";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const defaultPages: MetadataRoute.Sitemap = [
    // {
    //   url: "https://minabe.work/about",
    // },
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: "http://minabe.work",
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/favicon.ico`,
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
  try {
    const posts = await getNotionArticles();

    const blogPages: MetadataRoute.Sitemap = posts.results.map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...defaultPages, ...blogPages];
  } catch (error: unknown) {
    console.error("Failed to fetch articles for sitemap", error);

    return defaultPages;
  }
}
