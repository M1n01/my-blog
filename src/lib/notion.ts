import { Client } from "@notionhq/client";
import { NotionArticle } from "@/types/notionArticle";

// NotionClientのインスタンスを作成
const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
});

export async function getAllArticles() {
  if (!process.env.NEXT_PUBLIC_DATABASE_ID) {
    throw new Error("NEXT_PUBLIC_DATABASE_IDが設定されていません。");
  }

  const response = await notion.databases.query({
    database_id: process.env.NEXT_PUBLIC_DATABASE_ID,
    sorts: [
      {
        property: "publishedAt",
        direction: "descending",
      },
    ],
  });

  return response;
}
