import { NextResponse } from "next/server";
import { getArticleContent } from "../../../../lib/notion";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const slug = (await params).slug;
    const response = await getArticleContent(slug);

    console.debug("Fetched post:", response);

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
