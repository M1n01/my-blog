import { Suspense } from "react";
import { Alert, Title, Grid, GridCol, Center } from "@mantine/core";
import ArticleCard from "./blog/ArticleCard";
import { getAllArticles } from "@/lib/notion";
import PaginationControl from "./blog/PaginationControl";
import LoadingGrid from "./blog/loading";
import { Article } from "@/types/notion/Article";

export const runtime = "edge";
export const revalidate = 86400;

export const dynamic = "force-dynamic";

// 1ページあたりの記事数
const ITEMS_PER_PAGE = 9;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // searchParamsが非同期データを含む可能性があるため、安全に取り出す
  const pageParam = await searchParams;
  const currentPage = pageParam?.page ? parseInt(pageParam.page as string) : 1;

  let articles: Article[] = [];
  let error: string | null = null;
  let totalArticles = 0;
  let totalPages = 0;

  try {
    console.log("Fetching articles...");
    // 最初にトータル記事数を取得（実際のAPIリクエストでは必要に応じて実装）
    const allArticlesResult = await getAllArticles();
    totalArticles = allArticlesResult.articles.length;
    totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);

    // 現在のページに表示する記事を取得
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    articles = allArticlesResult.articles.slice(startIndex, endIndex);

    console.log(`Fetched articles for page ${currentPage}:`, articles);
  } catch (err) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = String(err);
    }
  }

  return (
    <>
      {error ? (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      ) : (
        <>
          <Title order={2} mb="lg">
            記事一覧
          </Title>

          <Suspense fallback={<LoadingGrid />}>
            <>
              <Grid gutter="lg">
                {articles?.map((post: Article) => (
                  <GridCol span={{ base: 12, sm: 6, md: 4 }} key={post.id}>
                    <ArticleCard post={post} />
                  </GridCol>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Center mt="xl">
                  <PaginationControl
                    total={totalPages}
                    currentPage={currentPage}
                  />
                </Center>
              )}
            </>
          </Suspense>
        </>
      )}
    </>
  );
}
