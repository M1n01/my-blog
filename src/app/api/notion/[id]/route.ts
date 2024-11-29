import { NextResponse } from "next/server";
import { getArticleContent } from "../../../../lib/notion";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    const response = await getArticleContent(id);

    return new NextResponse(JSON.stringify(response), {
      status: 200,
    });
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
