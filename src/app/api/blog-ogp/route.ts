import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface OGPData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://blog-ogp.abe-minato-bz.workers.dev?url=${encodeURIComponent(url)}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OGPData = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching OGP data:", error);
    return NextResponse.json(
      { error: "Failed to fetch OGP data" },
      { status: 500 },
    );
  }
}
