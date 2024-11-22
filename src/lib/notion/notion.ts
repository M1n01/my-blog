import { type NotionPost } from "../../types/notionPost";

import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getAllPosts(): Promise<NotionPost[]> {
  try {
    const res = await notion.databases.query({
      database_id: process.env.DATABASE_ID!,
      sorts: [
        {
          property: "publishedAt",
          direction: "descending",
        },
      ],
    });

    const posts = res.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title.title[0].plain_text ?? "",
      description: page.properties.Description.rich_text[0].plain_text ?? "",
      slug: page.properties.Slug.rich_text[0].plain_text ?? "",
      publishedAt: page.properties.PublishedAt.date.start ?? "",
      tags: page.properties.Tags.multi_select.map((tag: any) => tag.name),
      content: "", // contents will be fetched later
    }));
    return posts;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<NotionPost | null> {
  try {
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      console.error(`Post not found for slug: ${slug}`);
      return null;
    }

    const blocks = await notion.blocks.children.list({
      block_id: post.id,
    });
    console.table(blocks.results);

    const content = blocks.results
      .map((block: any) => {
        return block.paragraph?.rich_text[0].plain_text ?? "";
      })
      .join("\n\n");

    return {
      ...post,
      content,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}
