"use client";

import { AppShell } from "@mantine/core";
import { TableOfContents } from "@mantine/core";

export default function BlogContentAside() {
  return (
    <AppShell.Aside>
      <TableOfContents></TableOfContents>
    </AppShell.Aside>
  );
}
