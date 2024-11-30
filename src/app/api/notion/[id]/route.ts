import { NextResponse } from "next/server";
import { getArticleContent } from "../../../../lib/notion";

import { type Article } from "../../../../types/notion/Article";
import { type ArticleInfo } from "@/types/notion/ArticleInfo";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { searchParams } = new URL(request.url);
    const post = searchParams.get("post");

    // 一覧ページからの流入の場合
    if (post) {
      const postData: ArticleInfo = JSON.parse(post);
      const response: Article = await getArticleContent(postData.id, postData);

      return new NextResponse(JSON.stringify(response), {
        status: 200,
      });
    } else {
      const id = (await params).id;
      const response = await getArticleContent(id, null);

      return new NextResponse(JSON.stringify(response), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Failed to fetch post:", error);

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
