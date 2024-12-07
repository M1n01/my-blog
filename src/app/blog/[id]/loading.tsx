"use client";
import { Container, Skeleton } from "@mantine/core";
import Layout from "../_layout";

export default function LoadingContent() {
  return (
    <Layout>
      <Container size="md" py="xl">
        <Skeleton height={450} mb="xl" />
        <Skeleton height={50} mb="xl" />
        <Skeleton height={30} mb="md" />
        <Skeleton height={300} mb="md" />
      </Container>
    </Layout>
  );
}
