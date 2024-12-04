"use client";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Navbar, Header, Footer } from "../../components/layout";
import "@mantine/core/styles.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);

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
      <AppShell.Main>{children}</AppShell.Main>
      <Footer />
    </AppShell>
  );
}
