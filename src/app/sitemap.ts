import { getNotionArticles } from "@/lib/articles";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
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
  const posts = await getNotionArticles();
  if (posts.isErr()) {
    console.error("Failed to fetch posts:", posts.error);
    return defaultPages;
  }

  const blogPages: MetadataRoute.Sitemap = posts.value.results.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...defaultPages, ...blogPages];
}
