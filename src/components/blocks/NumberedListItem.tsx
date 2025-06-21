import { BlockWithChildren, renderBlocks } from "@/lib/blocks";
import { List } from "@mantine/core";
import {
  BlockObjectResponse,
  NumberedListItemBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import { renderRichText } from "./Paragraph";

export const NumberedListItem = ({
  block,
}: {
  block: NumberedListItemBlockObjectResponse & {
    children?: BlockObjectResponse[];
  };
}) => {
  // 子要素があれば処理
  const childContent =
    block.children && block.children.length > 0 ? (
      <List type="ordered">
        {renderBlocks(block.children as BlockWithChildren[])}
      </List>
    ) : null;

  return (
    <List.Item mb="sm">
      {block.numbered_list_item.rich_text.map((text, i) => (
        <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
      ))}
      {childContent}
    </List.Item>
  );
};
