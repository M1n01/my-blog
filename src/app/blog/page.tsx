import { Suspense } from "react";
import { Alert, Container, Title, Grid, GridCol } from "@mantine/core";
import BadgeCard from "./BadgeCard";
import { getAllArticles } from "@/lib/notion";

import Layout from "./_layout";
import LoadingGrid from "./loading";
import { Article } from "@/types/notion/Article";

export const runtime = "edge";
export const revalidate = 86400;

export default async function BlogList() {
  // const [activePage, setActivePage] = useState(1);
  // const postsPerPage = 9;

  let posts;
  let error;

  try {
    posts = await getAllArticles();
  } catch (e) {
    error =
      e instanceof Error
        ? e.message
        : "An error occurred while fetching articles.";
  }

  // const paginatedPosts = posts.slice(
  //   (activePage - 1) * postsPerPage,
  //   activePage * postsPerPage,
  // );
  return (
    <Layout>
      <Container size="lg" py="xl">
        {error ? (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        ) : (
          <>
            <Title order={1} mb="lg">
              Blog
            </Title>
            <Suspense fallback={<LoadingGrid />}>
              <Grid gutter="lg">
                {posts?.map((post: Article) => (
                  <GridCol span={{ base: 12, sm: 6, md: 4 }} key={post.id}>
                    <BadgeCard post={post} />
                  </GridCol>
                ))}
              </Grid>
            </Suspense>
          </>
        )}

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
    </Layout>
  );
}
