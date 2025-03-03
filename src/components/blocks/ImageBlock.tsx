"use client";

import React, { useState } from "react";
import { Image, Modal, Box } from "@mantine/core";
import { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const ImageBlock = ({
  block,
  index,
}: {
  block: ImageBlockObjectResponse;
  index: number;
}) => {
  const [opened, setOpened] = useState(false);
  const imageUrl =
    block.image.type === "external"
      ? block.image.external.url
      : block.image.file.url;
  const imageAlt = block.image.caption.map((text) => text.plain_text).join(" ");

  return (
    <>
      <Image
        key={index}
        src={imageUrl}
        alt={imageAlt}
        w="auto"
        fit="contain"
        radius="md"
        mah={300}
        mb="lg"
        mt="lg"
        style={{ cursor: "pointer" }}
        onClick={() => setOpened(true)}
      />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="xl"
        padding="md"
        centered
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fit="contain"
            style={{ maxHeight: "90vh" }}
          />
        </Box>
      </Modal>
    </>
  );
};
