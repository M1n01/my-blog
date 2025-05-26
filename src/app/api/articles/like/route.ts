import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// NotionClientのインスタンスを作成
const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
});

/**
 * 記事のいいね数を更新するAPIエンドポイント
 * @route POST /api/articles/like
 * @param request - リクエストオブジェクト（記事ID含む）
 * @returns いいね更新後の記事データ
 */
export async function POST(request: Request) {
  try {
    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json({ error: "記事IDが必要です" }, { status: 400 });
    }

    // 現在の記事情報を取得
    const response = await notion.pages.retrieve({
      page_id: articleId,
    });

    // 現在のいいね数を取得（ない場合は0）
    const currentLikes =
      response.properties.likes?.type === "number" &&
      response.properties.likes.number !== null
        ? response.properties.likes.number
        : 0;

    // いいね数を1増やす
    const updatedLikes = currentLikes + 1;

    // Notionのページを更新
    await notion.pages.update({
      page_id: articleId,
      properties: {
        likes: {
          number: updatedLikes,
        },
      },
    });

    return NextResponse.json({ likes: updatedLikes });
  } catch (error) {
    console.error("いいね処理中にエラーが発生しました:", error);
    return NextResponse.json(
      { error: "いいね処理中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
