import { headers } from "next/headers";
import { Title } from "@mantine/core";

export const runtime = "edge";

async function getArticles() {
  const headersData = await headers();
  const host = headersData.get("host");
  const protocol = headersData.get("x-forwarded-proto") || "http";
  const origin = `${protocol}://${host}`;

  try {
    const res = await fetch(`${origin}/api/notion`, {
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
    <Title order={1} style={{ marginTop: 20 }}>
      Blog
    </Title>
  );
}
