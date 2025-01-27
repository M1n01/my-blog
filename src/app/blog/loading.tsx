"use client";
import { Grid, GridCol, Skeleton } from "@mantine/core";

export default function LoadingGrid() {
  return (
    <Grid>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <GridCol key={`skeleton-${index}`} span={{ base: 12, sm: 6, md: 4 }}>
            <Skeleton height={200} radius="md" mb="xl" />
          </GridCol>
        ))}
    </Grid>
  );
}
