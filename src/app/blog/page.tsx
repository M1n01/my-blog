import { headers } from "next/headers";
import { Container, Title, Grid, GridCol } from "@mantine/core";
import BadgeCard from "./BadgeCard";

import Layout from "./_layout";
import { Article } from "@/types/notion/Article";

export const runtime = "edge";

async function getArticles() {
  const headersData = await headers();
  const host = headersData.get("host");
  const protocol = headersData.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;
  const url = `${origin}/api/notion`;
  console.log("url:", url);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch articles");
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return [];
  }
}

export default async function BlogList() {
  // const [activePage, setActivePage] = useState(1);
  // const postsPerPage = 9;

  const posts = await getArticles();
  console.log("posts:\n", posts);

  // const paginatedPosts = posts.slice(
  //   (activePage - 1) * postsPerPage,
  //   activePage * postsPerPage,
  // );

  return (
    <Layout>
      <Container size="lg" py="xl">
        <Title order={1}>Blog</Title>
        <Grid gutter="lg">
          {posts.map((post: Article) => (
            <GridCol span={{ base: 12, sm: 6, md: 4 }} key={post.id}>
              <BadgeCard key={post.id} post={post} />
            </GridCol>
          ))}
        </Grid>

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
