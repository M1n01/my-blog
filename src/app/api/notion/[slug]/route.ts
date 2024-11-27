import { NextResponse } from "next/server";
import { getArticleBySlug } from "../../../../lib/notion";

export async function GET(req: Request, { params }) {
  const id = params.slug;
  return NextResponse.json(await getArticleBySlug(id));
}
