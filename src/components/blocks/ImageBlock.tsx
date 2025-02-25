import React from "react";
import { Image } from "@mantine/core";
import { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const ImageBlock = ({
  block,
  index,
}: {
  block: ImageBlockObjectResponse;
  index: number;
}) => {
  return (
    <Image
      key={index}
      src={
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url
      }
      alt={block.image.caption.map((text) => text.plain_text).join(" ")}
      w="auto"
      fit="contain"
      radius="md"
      mah={300}
      mb="md"
    />
  );
};
