import ArticleCard from "@/components/blog/ArticleCard";
import LoadingGrid from "@/components/blog/LoadingGrid";
import PaginationControl from "@/components/blog/PaginationControl";
import { getArticleService } from "@/lib/articles/singleton";
import { Article } from "@/types/notion/Article";
import { Alert, Grid, GridCol, Title } from "@mantine/core";
import { Suspense } from "react";

// Edge runtime disabled for static export compatibility

// 1ページあたりの記事数
const ITEMS_PER_PAGE = 12;

export default async function HomePage() {
  // シングルトンインスタンスを使用
  const articleService = getArticleService();
  const result = await articleService.listArticles(null);

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
  // 最新の記事を最大12件表示
  const displayArticles = articles.slice(0, ITEMS_PER_PAGE);

  return (
    <>
      <Title order={2} mb="lg">
        記事一覧
      </Title>

      <Suspense fallback={<LoadingGrid />}>
        <Grid gutter="lg">
          {displayArticles.map((post: Article) => (
            <GridCol span={{ base: 12, sm: 6, md: 4 }} key={post.id}>
              <ArticleCard post={post} />
            </GridCol>
          ))}
        </Grid>
      </Suspense>
    </>
  );
}
