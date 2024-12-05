import { corsHeaders } from "../cors";
import { NextResponse } from "next/server";
import { getAllArticles } from "../../../lib/notion";

export const runtime = "edge";

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const response = await getAllArticles();
    return new NextResponse(JSON.stringify(response), {
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
