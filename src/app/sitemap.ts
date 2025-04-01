import { getArticleService } from "@/lib/articles/singleton";

import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const articleService = getArticleService();
  const defaultPages: MetadataRoute.Sitemap = [
    // {
    //   url: "https://minabe.work/about",
    // },
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "http://minabe.work",
      changeFrequency: "yearly",
      lastModified: new Date(),
      priority: 0.5,
    },
    {
      url: `${baseUrl}/favicon.ico`,
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
  const result = await articleService.listArticles(null);
  if (result.isErr()) {
    console.error("Failed to fetch posts:", result.error);
    return defaultPages;
  }

  const articles = result.value.articles;

  const blogPages: MetadataRoute.Sitemap = articles.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...defaultPages, ...blogPages];
}
