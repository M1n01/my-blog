import { Metadata } from "next";
import { ArticleCardList } from "@/components/blog/ArticleCardList";
import { getArticleService } from "@/lib/articles/singleton";
import { getCategoryService } from "@/lib/categories/singleton";
import { Category } from "@/types/notion/Category";
import { Text, Title, Stack } from "@mantine/core";
import { notFound } from "next/navigation";
import { PaginationControl } from "@/components/blog/PaginationControl";

interface CategoryPageProps {
  params: { id: string };
  searchParams: { cursor?: string };
}

// メタデータを動的に生成
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryInfo(params.id);

  if (!category) {
    return {
      title: "カテゴリが見つかりません",
      description: "指定されたカテゴリは存在しません。",
    };
  }

  return {
    title: `${category.name}の記事一覧`,
    description: `${category.name}カテゴリの記事一覧です。`,
  };
}

// カテゴリ情報を取得する関数
async function getCategoryInfo(id: string): Promise<Category | null> {
  const categoryService = getCategoryService();
  const result = await categoryService.getCategory(id);

  if (result.isErr()) {
    console.error("Failed to fetch category", result.error);
    return null;
  }

  return result.value;
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { id } = params;
  const { cursor } = searchParams;

  const category = await getCategoryInfo(id);

  if (!category) {
    notFound();
  }

  const service = getArticleService();
  const result = await service.listArticles(
    {
      startCursor: cursor,
      pageSize: 9,
    },
    { categoryId: id },
  );

  if (result.isErr()) {
    console.error("Failed to fetch articles", result.error);
    notFound();
  }

  const { articles, nextCursor, hasMore } = result.value;

  return (
    <Stack gap="xl">
      <Stack gap="xs">
        <Title order={1} mb="md">
          カテゴリ: {category.name}
        </Title>
        <Text c="dimmed" size="sm">
          {category.name}カテゴリの記事一覧です
        </Text>
      </Stack>

      {articles.length > 0 ? (
        <ArticleCardList articles={articles} />
      ) : (
        <Text ta="center" mt="xl" c="dimmed">
          このカテゴリの記事はまだありません。
        </Text>
      )}

      {hasMore && (
        <PaginationControl
          nextCursor={nextCursor}
          baseUrl={`/category/${id}`}
        />
      )}
    </Stack>
  );
}
