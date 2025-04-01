// クライアントコンポーネントを別ファイルとして切り出し
// /Users/abeminato/project/dev/my-blog/src/app/blog/PaginationControl.tsx として作成
"use client";

import { Pagination } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function PaginationControl({
  total,
  currentPage,
}: {
  total: number;
  currentPage: number;
}) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/blog?page=${page}`);
  };

  return (
    <Pagination
      total={total}
      value={currentPage}
      onChange={handlePageChange}
      mt="md"
      withEdges
    />
  );
}
