import { Suspense } from "react";
import { Container, Title, Grid, GridCol } from "@mantine/core";
import BadgeCard from "./BadgeCard";
import { getAllArticles } from "@/lib/notion";

import Layout from "./_layout";
import LoadingGrid from "./loading";
import { Article } from "@/types/notion/Article";

export const runtime = "edge";

export default async function BlogList() {
  // const [activePage, setActivePage] = useState(1);
  // const postsPerPage = 9;

  const posts = await getAllArticles();
  console.log("posts:\n", posts);

  // const paginatedPosts = posts.slice(
  //   (activePage - 1) * postsPerPage,
  //   activePage * postsPerPage,
  // );

  return (
    <Layout>
      <Container size="lg" py="xl">
        <Title order={1} mb="lg">
          Blog
        </Title>
        <Suspense fallback={<LoadingGrid />}>
          <Grid gutter="lg">
            {posts.map((post: Article) => (
              <GridCol span={{ base: 12, sm: 6, md: 4 }} key={post.id}>
                <BadgeCard key={post.id} post={post} />
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
    </Layout>
  );
}
