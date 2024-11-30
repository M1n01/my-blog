import { Client, isFullPage } from "@notionhq/client";
import {
  isNotionClientError,
  ClientErrorCode,
  APIErrorCode,
} from "@notionhq/client/build/src/errors";
import { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

import { type Article } from "../types/notion/Article";

// NotionClientのインスタンスを作成
const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
});

export async function getAllArticles() {
  if (!process.env.NEXT_PUBLIC_DATABASE_ID) {
    throw new Error("NEXT_PUBLIC_DATABASE_IDが設定されていません。");
  }

  try {
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
    if (response) {
      console.debug("Fetched articles in getAllArticles:", response);
      return response;
    } else {
      throw new Error("Failed to fetch articles");
    }
  } catch (error: unknown) {
    if (isNotionClientError(error)) {
      switch (error.code) {
        case ClientErrorCode.RequestTimeout:
          console.error(
            "Notion APIの認証に失敗しました。環境変数NEXT_PUBLIC_NOTION_TOKENが正しく設定されているか確認してください。",
          );
          break;
        case APIErrorCode.ObjectNotFound:
          console.error(
            "Notion APIのデータベースが見つかりませんでした。環境変数NEXT_PUBLIC_DATABASE_IDが正しく設定されているか確認してください。",
          );
          break;
        case APIErrorCode.Unauthorized:
          console.error(
            "Notion APIのリクエストに失敗しました。環境変数NEXT_PUBLIC_DATABASE_IDが正しく設定されているか確認してください。",
          );
          break;
        default:
          console.error("Notion APIのリクエストに失敗しました。", error);
      }
    }
    throw error; // Add this line to propagate the error
  }
}

export async function getArticle(id: string) {
  const response: GetPageResponse = await notion.pages.retrieve({
    page_id: id,
  });
  console.debug("[Fetched article in getArticle]:\n", response);

  if (isFullPage(response)) {
    return {
      id: response.id,
      thumbnail:
        response.cover?.type === "external" ? response.cover.external.url : "",
      title:
        response.properties.title.type === "title"
          ? response.properties.title.title[0].plain_text
          : "",
      description:
        response.properties.description?.type === "rich_text"
          ? response.properties.description.rich_text[0].plain_text
          : "",
      publishedAt:
        response.properties.publishedAt.type === "date"
          ? (response.properties.publishedAt.date?.start ?? "")
          : "", // date型でないまたはnullの場合は空文字を返す
      updatedAt: response.last_edited_time,
      tags:
        response.properties.tags?.type === "multi_select"
          ? response.properties.tags.multi_select.map((tag) => ({
              id: tag.id,
              name: tag.name,
              color: tag.color,
            }))
          : [],
    };
  } else {
    return null;
  }
}

export const getArticleContent = async (
  id: string,
  article: Article | null,
) => {
  let articleData = article;

  // query paramsがない場合
  if (articleData === null) {
    articleData = await getArticle(id);
    if (articleData === null) {
      throw new Error("Article not found");
    }
    console.debug("articleInfo:\n", articleData);
  }

  try {
    const res = await notion.blocks.children.list({
      block_id: id,
    });
    console.debug("[Fetched blocks in getArticleContent]:\n", res);

    if (res.results) {
      articleData.content = res.results;
    }

    return articleData;
  } catch (error: unknown) {
    console.error("Failed to fetch article content:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch article content");
  }
};
