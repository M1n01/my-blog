import React from "react";
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
import { BulletedList, NumberedList } from "@/components/blocks/Lists";
import {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  NumberedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const blockToJsx = (block: BlockObjectResponse, index: number) => {
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
    case "quote":
      return <QuoteBlock block={block} index={index} />;
    case "bookmark":
      return null;
    default:
      return null;
  }
};

// リストとそれ以外のブロックを適切な順序で描画する
export const renderBlocks = (blocks: BlockObjectResponse[]) => {
  const result: JSX.Element[] = [];
  let currentListItems: BlockObjectResponse[] = [];
  let currentListType: "bulleted" | "numbered" | null = null;

  // 全ブロックを順番に処理
  blocks.forEach((block, index) => {
    // リストアイテムの場合
    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const listType =
        block.type === "bulleted_list_item" ? "bulleted" : "numbered";

      // 新しいリストタイプが始まった場合、前のリストを描画
      if (
        currentListType &&
        currentListType !== listType &&
        currentListItems.length > 0
      ) {
        renderListGroup(result, currentListItems, currentListType);
        currentListItems = [];
      }

      currentListType = listType;
      currentListItems.push(block);
    }
    // リストアイテム以外の場合
    else {
      // 未処理のリストアイテムがあれば先に描画
      if (currentListItems.length > 0) {
        renderListGroup(result, currentListItems, currentListType!);
        currentListItems = [];
        currentListType = null;
      }

      // 現在のブロックを描画
      if (!isFullBlock(block)) return null;
      const element = blockToJsx(block, index);
      if (element) {
        result.push(element);
      }
    }
  });

  // 最後に残ったリストアイテムを処理
  if (currentListItems.length > 0 && currentListType) {
    renderListGroup(result, currentListItems, currentListType);
  }

  return result;
};

// リストグループを適切なコンポーネントとして描画
const renderListGroup = (
  result: JSX.Element[],
  items: BlockObjectResponse[],
  type: "bulleted" | "numbered",
) => {
  if (type === "bulleted") {
    result.push(
      <BulletedList
        key={`bulleted-${items[0].id}`}
        items={items as BulletedListItemBlockObjectResponse[]}
      />,
    );
  } else {
    result.push(
      <NumberedList
        key={`numbered-${items[0].id}`}
        items={items as NumberedListItemBlockObjectResponse[]}
      />,
    );
  }
};
