import { Client } from "@notionhq/client";
import {
  GetPageResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { NextResponse } from "next/server";

// NotionClientのインスタンスを作成
const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
});

function isPageObjectResponse(
  response: GetPageResponse | PartialPageObjectResponse,
): response is PageObjectResponse {
  return response.object === "page" && "properties" in response;
}

/**
 * 記事のいいね数を更新するAPIエンドポイント
 * @route POST /api/articles/like
 * @param request - リクエストオブジェクト（記事ID含む）
 * @returns いいね更新後の記事データ
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { articleId: string };
    const articleId = body.articleId;

    if (!articleId) {
      return NextResponse.json({ error: "記事IDが必要です" }, { status: 400 });
    }

    // 現在の記事情報を取得
    const response = await notion.pages.retrieve({
      page_id: articleId,
    });

    if (!isPageObjectResponse(response)) {
      return NextResponse.json(
        { error: "プロパティが取得できません" },
        { status: 500 },
      );
    }

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

/**
 * 記事のいいね数を取得するAPIエンドポイント
 * @route GET /api/articles/like
 * @param request - リクエストオブジェクト（記事ID含む）
 * @returns いいね数
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("articleId");
  if (!articleId) {
    return NextResponse.json({ error: "記事IDが必要です" }, { status: 400 });
  }
  try {
    const response = (await notion.pages.retrieve({
      page_id: articleId,
    })) as GetPageResponse;
    if (!isPageObjectResponse(response)) {
      return NextResponse.json(
        { error: "プロパティが取得できません" },
        { status: 500 },
      );
    }
    const currentLikes =
      response.properties.likes?.type === "number" &&
      response.properties.likes.number !== null
        ? response.properties.likes.number
        : 0;
    return NextResponse.json({ likes: currentLikes });
  } catch (error) {
    return NextResponse.json(
      { error: "いいね数の取得に失敗しました" + error },
      { status: 500 },
    );
  }
}
