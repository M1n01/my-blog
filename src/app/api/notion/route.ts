import { corsHeaders } from "../cors";
import { NextResponse } from "next/server";
import { getAllArticles } from "../../../lib/notion";
import { Article } from "../../../types/notion/Article";
import { type Tag } from "../../../types/notion/Tag";
import { isFullPageOrDatabase } from "@notionhq/client";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const response = (await getAllArticles()).results;
    if (response) {
      const articles: Article[] = response.map((post) => {
        if (isFullPageOrDatabase(post)) {
          return {
            id: post.id,
            thumbnail:
              post.cover?.type === "external"
                ? post.cover.external.url
                : undefined,
            title:
              post.properties.title.type === "title"
                ? post.properties.title.title
                    .map((title) => title.plain_text)
                    .join("")
                : "",
            description:
              post.properties.description.type === "rich_text"
                ? post.properties.description.rich_text
                    .map((description) => description.plain_text)
                    .join("")
                : "",
            publishedAt:
              post.properties.publishedAt.type === "date"
                ? (post.properties.publishedAt.date?.start ?? "")
                : "",
            updatedAt: post.last_edited_time,
            tags:
              post.properties.tags.type === "multi_select" &&
              Array.isArray(post.properties.tags.multi_select)
                ? post.properties.tags.multi_select.map((tag: Tag) => ({
                    id: tag.id,
                    name: tag.name,
                    color: tag.color,
                  }))
                : [],
            content: undefined,
          };
        } else {
          return {
            id: post.id,
            thumbnail: undefined,
            title: "",
            description: "",
            publishedAt: "",
            updatedAt: "",
            tags: [],
            content: undefined,
          };
        }
      });
      return new NextResponse(JSON.stringify(articles), {
        status: 200,
      });
    } else {
      // undefined
      return new NextResponse(
        JSON.stringify({ error: "データが見つかりませんでした。" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (error) {
    console.error("データの取得に失敗しました:", error);

    return new NextResponse(
      JSON.stringify({ error: "データの取得に失敗しました。" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
