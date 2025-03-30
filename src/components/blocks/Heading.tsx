import React from "react";
import { Title } from "@mantine/core";
import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const Heading1 = ({
  block,
  index,
}: {
  block: Heading1BlockObjectResponse;
  index: number;
}) => {
  const text = block.heading_1.rich_text[0]?.plain_text || "";
  const headingId = `heading-1-${index}`;

  return (
    <Title key={index} order={2} mb="xs" mt="lg" size="h1" id={headingId}>
      {text}
    </Title>
  );
};

export const Heading2 = ({
  block,
  index,
}: {
  block: Heading2BlockObjectResponse;
  index: number;
}) => {
  const text = block.heading_2.rich_text[0]?.plain_text || "";
  const headingId = `heading-2-${index}`;

  return (
    <Title
      key={index}
      order={3}
      size="h2"
      mb="xs"
      mt="lg"
      style={{ borderBottom: "4px dashed", display: "inline" }}
      id={headingId}
    >
      {text}
    </Title>
  );
};

export const Heading3 = ({
  block,
  index,
}: {
  block: Heading3BlockObjectResponse;
  index: number;
}) => {
  const text = block.heading_3.rich_text[0]?.plain_text || "";
  const headingId = `heading-3-${index}`;

  return (
    <Title key={index} order={4} size="h3" mb="xs" mt="lg" id={headingId}>
      {text}
    </Title>
  );
};
