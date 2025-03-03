import React from "react";
import { Title } from "@mantine/core";
import {
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

type HeadingProps = {
  text: string;
  level: 1 | 2 | 3;
  id?: string;
};

export function Heading({ text, level, id }: HeadingProps) {
  return (
    <Title order={level} id={id} mt="md" mb="sm">
      {text}
    </Title>
  );
}

export const Heading1 = ({
  block,
  index,
}: {
  block: Heading1BlockObjectResponse;
  index: number;
}) => {
  return (
    <Heading
      key={index}
      level={1}
      text={block.heading_1.rich_text[0].plain_text}
      id={`heading-1-${index}`}
    />
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
    <Heading
      key={index}
      level={2}
      text={block.heading_2.rich_text[0].plain_text}
      id={`heading-2-${index}`}
    />
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
    <Heading
      key={index}
      level={3}
      text={block.heading_3.rich_text[0].plain_text}
      id={`heading-3-${index}`}
    />
  );
};
