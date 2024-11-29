import { corsHeaders } from "../cors";
import { NextResponse } from "next/server";
import { getAllArticles } from "../../../lib/notion";
import { NotionArticle } from "@/types/notionArticle";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const response = await getAllArticles();

    const articles: NotionArticle[] = response.results.map((post: any) => {
      return {
        id: post.id,
        thumbnail: post.cover?.external.url,
        title: post.properties.title.title[0].plain_text,
        description: post.properties.description.rich_text[0]?.plain_text,
        publishedAt: post.properties.publishedAt.date.start,
        tags: post.properties.tags.multi_select.map((tag: any) => ({
          id: tag.id,
          name: tag.name,
          color: tag.color,
        })),
        content: "", // あとで取得する
      };
    });

    return new NextResponse(JSON.stringify(articles), {
      status: 200,
    });
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
