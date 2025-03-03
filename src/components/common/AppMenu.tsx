"use client";
import { usePathname } from "next/navigation";
import { AppShell, Breadcrumbs, Anchor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import "@mantine/core/styles.css";

import Navbar from "./Navbar";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);

  const pathname = usePathname();
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((path, index, array) => {
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
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
