import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

// NotionClientのインスタンスを作成
const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
});

// 全ての記事を取得する関数
export async function getAllArticles() {
  if (!process.env.NEXT_PUBLIC_DATABASE_ID) {
    throw new Error("NEXT_PUBLIC_DATABASE_IDが設定されていません。");
  }

  const response = await notion.databases.query({
    database_id: process.env.NEXT_PUBLIC_DATABASE_ID,
    filter: {
      property: "publishedAt",
      date: {
        is_not_empty: true,
      },
    },
    sorts: [
      {
        property: "publishedAt",
        direction: "descending",
      },
    ],
  });
  console.debug("Fetched articles in getAllArticles:", response);

  return response;
}

const n2m = new NotionToMarkdown({ notionClient: notion });

// スラッグを元に記事を取得する関数
export const getArticleContent = async (id: string) => {
  const response = await notion.pages.retrieve({
    page_id: id,
  });
  console.debug("Fetched article in getArticleContent:", response);

  const mdblocks = await n2m.pageToMarkdown(id);
  console.debug("[Converted content in getArticleContent]:\n", mdblocks);

  return mdblocks;
};
