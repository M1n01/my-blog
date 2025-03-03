"use client";

import { AppShell } from "@mantine/core";
import { TableOfContents } from "@mantine/core";
import { useBlogContext } from "@/app/context/article.context";
import { useTableOfContents } from "@/app/hooks/useTableOfContents";

export default function BlogContentAside() {
  const { tableOfContents } = useBlogContext();
  useTableOfContents();

  const links = tableOfContents.map((item) => ({
    label: item.text,
    link: `#${item.id}`,
    order: item.level,
  }));

  return (
    <AppShell.Aside p="md" w={300}>
      <TableOfContents links={links} />
    </AppShell.Aside>
  );
}
