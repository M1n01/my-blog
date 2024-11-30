import { corsHeaders } from "../cors";
import { NextResponse } from "next/server";
import { getAllArticles } from "../../../lib/notion";
import { Article } from "../../../types/notion/Article";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const response = await getAllArticles();
    if (response) {
      const articles: Article[] = response.results.map((post: any) => {
        return {
          id: post.id,
          thumbnail: post.cover?.external.url,
          title: post.properties.title.title[0].plain_text,
          description: post.properties.description.rich_text[0]?.plain_text,
          publishedAt: post.properties.publishedAt.date.start,
          updatedAt: post.last_edited_time,
          tags: post.properties.tags.multi_select.map((tag: any) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          })),
          content: undefined,
        };
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
