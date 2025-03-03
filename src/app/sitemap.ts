import { getNotionArticles } from "@/lib/notion";
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
  try {
    const posts = await getNotionArticles();

    const blogPages: MetadataRoute.Sitemap = posts.results.map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...defaultPages, ...blogPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return defaultPages;
  }
}
