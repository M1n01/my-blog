import { corsHeaders } from "../cors";
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_TOKEN,
});

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_DATABASE_ID) {
      throw new Error("NEXT_PUBLIC_DATABASE_IDが設定されていません。");
    }
    const res = await notion.databases.query({
      database_id: process.env.NEXT_PUBLIC_DATABASE_ID!,
      sorts: [
        {
          property: "PublishedAt",
          direction: "descending",
        },
      ],
    });
    return new NextResponse(JSON.stringify(res), {
      status: 200,
    });
  } catch (error) {
    console.error("データの取得に失敗しました:", error);

    // エラーレスポンスを返す
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
