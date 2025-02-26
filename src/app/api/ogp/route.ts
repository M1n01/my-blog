import { NextRequest } from "next/server";
import { JSDOM } from "jsdom";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: "URL is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(targetUrl);
    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // OGPメタデータの抽出
    const getMetaContent = (property: string) => {
      const meta = document.querySelector(
        `meta[property="${property}"], meta[name="${property}"]`,
      );
      return meta?.getAttribute("content") || "";
    };

    const ogpData = {
      title: getMetaContent("og:title") || document.title,
      description:
        getMetaContent("og:description") || getMetaContent("description"),
      image: getMetaContent("og:image"),
    };

    return new Response(JSON.stringify(ogpData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OGP fetch error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch OGP data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
