import { Suspense } from "react";
import { Container, Title, Grid, GridCol } from "@mantine/core";
import ArticleCard from "./ArticleCard";
import { getAllArticles } from "@/lib/notion";

import LoadingGrid from "./loading";
import { Article } from "@/types/notion/Article";

export const runtime = "edge";
export const revalidate = 86400;

export default async function BlogList() {
  // const [activePage, setActivePage] = useState(1);
  // const postsPerPage = 9;

  const posts = await getAllArticles();

  // const paginatedPosts = posts.slice(
  //   (activePage - 1) * postsPerPage,
  //   activePage * postsPerPage,
  // );
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Articles
      </Title>
      <Suspense fallback={<LoadingGrid />}>
        <Grid gutter="lg">
          {posts?.map((post: Article) => (
            <GridCol span={{ base: 12, sm: 6, md: 4 }} key={post.id}>
              <ArticleCard post={post} />
            </GridCol>
          ))}
        </Grid>
      </Suspense>

      {/* {!loading && Math.ceil(posts.length / postsPerPage) > 1 && (
          <Group justify="center" mt="xl">
            <Pagination
              value={activePage}
              onChange={setActivePage}
              total={Math.ceil(posts.length / postsPerPage)}
            />
          </Group>
        )} */}
    </Container>
  );
}
