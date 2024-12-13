import type { MetadataRoute } from "next";
// import { getAllArticles } from "@/lib/notion";
// import { Article } from "@/types/notion/Article";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages: MetadataRoute.Sitemap = [
    {
      url: "https://minabe.work",
    },
    // {
    //   url: "https://minabe.work/about",
    // },
    {
      url: "https://minabe.work/blog",
    },
  ];

  // const posts = await getAllArticles();

  // const blogPages: MetadataRoute.Sitemap = posts.map((post: Article) => ({
  //   url: `https://minabe.work/blog/${post.id}`,
  //   lastModified: new Date(post.updatedAt),
  // }));

  // return [...defaultPages, ...blogPages];
  return defaultPages;
}
