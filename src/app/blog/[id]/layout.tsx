"use client";

import { AppShell } from "@mantine/core";
import BlogContentAside from "@/components/blog/BlogAside";

export default function BlogContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell
      aside={{
        width: 300,
        breakpoint: "md",
        collapsed: { desktop: false, mobile: true },
      }}
    >
      <BlogContentAside />
      {children}
    </AppShell>
  );
}
