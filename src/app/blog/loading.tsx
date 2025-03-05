"use client";
import { Container, Grid, GridCol, Skeleton, Title } from "@mantine/core";

// 1ページあたりの記事数と一致させる
const SKELETON_COUNT = 9;

export default function LoadingGrid() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        記事一覧
      </Title>
      <Grid gutter="lg">
        {Array(SKELETON_COUNT)
          .fill(0)
          .map((_, index) => (
            <GridCol
              key={`skeleton-${index}`}
              span={{ base: 12, sm: 6, md: 4 }}
            >
              <Skeleton height={200} radius="md" mb="sm" />
              <Skeleton height={20} width="70%" radius="xl" mb="sm" />
              <Skeleton height={15} width="40%" radius="xl" mb="sm" />
              <Skeleton height={10} width="30%" radius="xl" />
            </GridCol>
          ))}
      </Grid>
    </Container>
  );
}
