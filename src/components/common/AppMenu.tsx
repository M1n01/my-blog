"use client";
import { Anchor, AppShell, Breadcrumbs, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import "@mantine/core/styles.css";

import Header from "./Header";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);

  const pathname = usePathname();
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((path, index, array) => {
      // blogの場合はルートに遷移
      if (path === "blog") {
        return (
          <Anchor href="/" key={index}>
            blog
          </Anchor>
        );
      }
      const href = "/" + array.slice(0, index + 1).join("/");
      // ルートページには特別な表示をせず、記事ページのIDは「Article」として表示
      if (path.length === 36) {
        return "Article";
      }
      return (
        <Anchor href={href} key={index}>
          {path}
        </Anchor>
      );
    });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <Header opened={opened} toggle={toggle} />
      <Navbar opened={opened} />
      <AppShell.Main>
        <Container size="md" py="xl">
          <Breadcrumbs mb="lg">{breadcrumbs}</Breadcrumbs>
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
