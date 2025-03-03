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
  return (
    <Title key={index} order={2} mb="xs" mt="lg">
      {block.heading_1.rich_text[0].plain_text}
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
  return (
    <Title
      key={index}
      order={3}
      mb="xs"
      mt="lg"
      style={{ borderBottom: "4px dashed", display: "inline" }}
    >
      {block.heading_2.rich_text[0].plain_text}
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
  return (
    <Title key={index} order={4} mb="xs" mt="lg">
      {block.heading_3.rich_text[0].plain_text}
    </Title>
  );
};
