import React from "react";
import { type Block } from "@/types/notion/Article";
import { isFullBlock } from "@notionhq/client";

import { CodeHighlight } from "@mantine/code-highlight";
import { Anchor, Image, Title, Text, Blockquote } from "@mantine/core";
import { type RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

type TextProps = {
  component: "span";
  fw?: 400 | 700;
  fs?: "italic" | "normal";
  td?: "line-through" | "underline" | "none";
  ff?: "monospace";
  c?: string;
};

const renderRichText = (text: RichTextItemResponse) => {
  const underlineEnabled = text.annotations.underline;
  const props: TextProps = {
    component: "span",
    fw: text.annotations.bold ? 700 : 400,
    fs: text.annotations.italic ? "italic" : "normal",
    td: text.annotations.strikethrough ? "line-through" : "none",
    ff: text.annotations.code ? "monospace" : undefined,
    c:
      text.annotations.color !== "default" ? text.annotations.color : undefined,
  };

  const customStyle = underlineEnabled ? { borderBottom: "1px dashed" } : {};

  if (text.href) {
    return (
      <Anchor
        href={text.href}
        target="_blank"
        fw={props.fw}
        fs={props.fs}
        td={props.td}
        ff={props.ff}
        c="gray"
        style={customStyle}
      >
        {text.plain_text}
      </Anchor>
    );
  }

  return (
    <Text {...props} style={customStyle}>
      {text.plain_text}
    </Text>
  );
};

export const blockToJsx = (block: Block, index: number) => {
  if (!isFullBlock(block)) return null;
  switch (block.type) {
    case "heading_1":
      return (
        <Title key={index} order={2} mb="xs" mt="lg">
          {block.heading_1.rich_text[0].plain_text}
        </Title>
      );
    case "heading_2":
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
    case "heading_3":
      return (
        <Title key={index} order={4} mb="xs" mt="lg">
          {block.heading_3.rich_text[0].plain_text}
        </Title>
      );
    case "paragraph":
      return (
        <Text key={index}>
          {block.paragraph.rich_text.map((text, i) => (
            <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
          ))}
        </Text>
      );
    case "code":
      return (
        <CodeHighlight
          key={index}
          code={block.code.rich_text.map((text) => text.plain_text).join("")}
          copyLabel="Copy button code"
          copiedLabel="Copied!"
          language={block.code.language}
          mb="md"
        />
      );
    case "image":
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
    case "bulleted_list_item":
      return null;
    case "numbered_list_item":
      return null;
    case "quote":
      return (
        <Blockquote key={index} color="violet">
          {block.quote.rich_text.map((text) => text.plain_text)}
        </Blockquote>
      );
    case "embed":
      return null;
    default:
      return null;
  }
};
