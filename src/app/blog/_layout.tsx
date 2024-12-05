"use client";
import { usePathname } from "next/navigation";
import { AppShell, Breadcrumbs, Anchor } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Navbar, Header, Footer } from "../../components/layout";
import "@mantine/core/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);

  const pathname = usePathname();
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((path, index, array) => {
      const href = "/" + array.slice(0, index + 1).join("/");
      if (path === "blog") {
        path = "Top page";
      } else if (path.length === 36) {
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
      footer={{ height: 40 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: false, mobile: true },
      }}
      padding="md"
    >
      <Header opened={opened} toggle={toggle} />
      <Navbar opened={opened} toggle={toggle} />
      <AppShell.Main>
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        {children}
      </AppShell.Main>
      <Footer />
    </AppShell>
  );
}
