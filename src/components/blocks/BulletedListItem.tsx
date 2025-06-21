import { BlockWithChildren, renderBlocks } from "@/lib/blocks";
import { List } from "@mantine/core";
import { BulletedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import { renderRichText } from "./Paragraph";

export const BulletedListItem = ({
  block,
}: {
  block: BulletedListItemBlockObjectResponse & {
    children?: BlockObjectResponse[];
  };
}) => {
  // 子要素があれば処理
  const childContent =
    block.children && block.children.length > 0 ? (
      <List>{renderBlocks(block.children as BlockWithChildren[])}</List>
    ) : null;

  return (
    <List.Item mb="sm">
      {block.bulleted_list_item.rich_text.map((text, i) => (
        <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
      ))}
      {childContent}
    </List.Item>
  );
};
