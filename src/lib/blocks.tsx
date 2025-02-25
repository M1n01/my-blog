import React from "react";
import { type Block } from "@/types/notion/Article";
import { isFullBlock } from "@notionhq/client";

import {
  Paragraph,
  Heading1,
  Heading2,
  Heading3,
  CodeBlock,
  ImageBlock,
  QuoteBlock,
} from "@/components/blocks";

export const blockToJsx = (block: Block, index: number) => {
  if (!isFullBlock(block)) return null;
  switch (block.type) {
    case "heading_1":
      return <Heading1 block={block} index={index} />;
    case "heading_2":
      return <Heading2 block={block} index={index} />;
    case "heading_3":
      return <Heading3 block={block} index={index} />;
    case "paragraph":
      return <Paragraph block={block} index={index} />;
    case "code":
      return <CodeBlock block={block} index={index} />;
    case "image":
      return <ImageBlock block={block} index={index} />;
    case "bulleted_list_item":
      return null;
    case "numbered_list_item":
      return null;
    case "quote":
      return <QuoteBlock block={block} index={index} />;
    case "embed":
      return null;
    default:
      return null;
  }
};
