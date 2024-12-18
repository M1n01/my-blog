import { Suspense } from "react";
import { Alert, Container, Title, Grid, GridCol } from "@mantine/core";
import ArticleCard from "./ArticleCard";
import { getAllArticles } from "@/lib/notion";

import LoadingGrid from "./loading";
import { Article } from "@/types/notion/Article";

export const runtime = "edge";
export const revalidate = 86400;

export default async function BlogList() {
  let articles: Article[] = [];
  let error: string | null = null;

  try {
    articles = await getAllArticles();
  } catch (err) {
    if (err instanceof Error) {
      error = err.message;
    } else {
      error = String(err);
    }
  }

  return (
    <Container size="lg" py="xl">
      {error ? (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      ) : (
        <>
          <Title order={2} mb="lg">
            Articles
          </Title>
          <Suspense fallback={<LoadingGrid />}>
            <Grid gutter="lg">
              {articles?.map((post: Article) => (
                <GridCol span={{ base: 12, sm: 6, md: 4 }} key={post.id}>
                  <ArticleCard post={post} />
                </GridCol>
              ))}
            </Grid>
          </Suspense>
        </>
      )}
    </Container>
  );
}
