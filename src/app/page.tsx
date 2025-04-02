import { Suspense } from "react";
import { Alert, Title, Grid, GridCol, Center } from "@mantine/core";
import ArticleCard from "@/components/blog/ArticleCard";
import PaginationControl from "@/components/blog/PaginationControl";
import LoadingGrid from "@/components/blog/LoadingGrid";
import { Article } from "@/types/notion/Article";
import { getArticleService } from "@/lib/articles/singleton";

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
  const pageParam = await searchParams;
  const currentPage = pageParam?.page ? parseInt(pageParam.page as string) : 1;

  // シングルトンインスタンスを使用
  const articleService = getArticleService();
  const result = await articleService.listArticles({
    pageSize: ITEMS_PER_PAGE,
  });

  // Result型のエラーハンドリング
  if (result.isErr()) {
    const error = result.error;
    return (
      <Alert color="red" title="Error">
        {error.type === "NOTION_ERROR" ? error.error.message : error.message}
      </Alert>
    );
  }

  const { articles } = result.value;
  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);

  // 現在のページに表示する記事を取得
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageArticles = articles.slice(startIndex, endIndex);

  return (
    <>
      <Title order={2} mb="lg">
        記事一覧
      </Title>

      <Suspense fallback={<LoadingGrid />}>
        <>
          <Grid gutter="lg">
            {currentPageArticles.map((post: Article) => (
              <GridCol span={{ base: 12, sm: 6, md: 4 }} key={post.id}>
                <ArticleCard post={post} />
              </GridCol>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Center mt="xl">
              <PaginationControl total={totalPages} currentPage={currentPage} />
            </Center>
          )}
        </>
      </Suspense>
    </>
  );
}
