import { Container, Text, Stack } from "@mantine/core";
// import ArticleCard from "./ArticleCard";g
import { getAllArticles } from "@/lib/notion";
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
      {posts?.map((post: Article) => {
        console.log("Passing post to ArticleCard:", post); // 👈  追加
        return (
          <Stack gap="lg" key={post.id}>
            <Text>{post.title}</Text>
          </Stack>
        );
      })}

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
