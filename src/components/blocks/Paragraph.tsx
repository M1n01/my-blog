import React from "react";
import { TextProps } from "@/types/notion/Article";
import { Anchor, Text, Code } from "@mantine/core";
import {
  ParagraphBlockObjectResponse,
  type RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const renderRichText = (text: RichTextItemResponse) => {
  const underlineEnabled = text.annotations.underline;
  const props: TextProps = {
    component: "span",
    fw: text.annotations.bold ? 700 : 400,
    fs: text.annotations.italic ? "italic" : "normal",
    td: text.annotations.strikethrough ? "line-through" : "none",
    c:
      text.annotations.color !== "default" ? text.annotations.color : undefined,
  };

  const customStyle = {
    ...(underlineEnabled ? { borderBottom: "1px dashed" } : {}),
    fontSize: "var(--blog-font-size)",
    fontFamily: "var(--blog-font-family)",
  };

  if (text.annotations.code) {
    return (
      <Code style={{ fontSize: "var(--blog-font-size)" }}>
        {text.plain_text}
      </Code>
    );
  }

  if (text.href) {
    return (
      <Anchor
        href={text.href}
        target="_blank"
        fw={props.fw}
        fs={props.fs}
        td={props.td}
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

export const Paragraph = ({
  block,
  index,
}: {
  block: ParagraphBlockObjectResponse;
  index: number;
}) => {
  return (
    <Text
      key={index}
      style={{
        fontSize: "var(--blog-font-size)",
        fontFamily: "var(--blog-font-family)",
      }}
    >
      {block.paragraph.rich_text.map((text, i) => (
        <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
      ))}
    </Text>
  );
};
