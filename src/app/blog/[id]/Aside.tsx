"use client";

import { AppShell } from "@mantine/core";
import { TableOfContent } from "./TableOfContents";

export default function BlogContentAside() {
  return (
    <AppShell.Aside>
      <TableOfContent />
    </AppShell.Aside>
  );
}
