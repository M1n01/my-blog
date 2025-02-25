import React from "react";
import { List } from "@mantine/core";
import {
  BulletedListItemBlockObjectResponse,
  BlockObjectResponse,
  NumberedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { renderRichText } from "./Paragraph";

// リストブロックをグループ化するためのヘルパー関数
export const groupListItems = (blocks: BlockObjectResponse[]) => {
  const groups: {
    type: "bulleted" | "numbered";
    items: (
      | BulletedListItemBlockObjectResponse
      | NumberedListItemBlockObjectResponse
    )[];
  }[] = [];

  let currentGroup: {
    type: "bulleted" | "numbered";
    items: (
      | BulletedListItemBlockObjectResponse
      | NumberedListItemBlockObjectResponse
    )[];
  } | null = null;

  blocks.forEach((block) => {
    if (block.type === "bulleted_list_item") {
      if (!currentGroup || currentGroup.type !== "bulleted") {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { type: "bulleted", items: [] };
      }
      currentGroup.items.push(block as BulletedListItemBlockObjectResponse);
    } else if (block.type === "numbered_list_item") {
      if (!currentGroup || currentGroup.type !== "numbered") {
        if (currentGroup) {
          groups.push(currentGroup);
        }
        currentGroup = { type: "numbered", items: [] };
      }
      currentGroup.items.push(block as NumberedListItemBlockObjectResponse);
    } else {
      if (currentGroup) {
        groups.push(currentGroup);
        currentGroup = null;
      }
    }
  });

  if (currentGroup) {
    groups.push(currentGroup);
  }

  return groups;
};

// 箇条書きリストのコンポーネント
export const BulletedList = ({
  items,
}: {
  items: BulletedListItemBlockObjectResponse[];
}) => {
  return (
    <List withPadding>
      {items.map((item, index) => (
        <List.Item key={item.id || index}>
          {item.bulleted_list_item.rich_text.map((text, i) => (
            <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
          ))}
        </List.Item>
      ))}
    </List>
  );
};

// 番号付きリストのコンポーネント
export const NumberedList = ({
  items,
}: {
  items: NumberedListItemBlockObjectResponse[];
}) => {
  return (
    <List type="ordered" withPadding>
      {items.map((item, index) => (
        <List.Item key={item.id || index}>
          {item.numbered_list_item.rich_text.map((text, i) => (
            <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
          ))}
        </List.Item>
      ))}
    </List>
  );
};
