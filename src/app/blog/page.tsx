import { Suspense } from "react";
import { Container, Title } from "@mantine/core";
import ArticleCards from "./ArticleCards";
import { getAllArticles } from "@/lib/notion";

import LoadingGrid from "./loading";

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
        <ArticleCards posts={posts} />
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
