import React from "react";
import { List } from "@mantine/core";
import {
  NumberedListItemBlockObjectResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { renderRichText } from "./Paragraph";
import { BlockWithChildren, renderBlocks } from "@/lib/blocks";

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
      <List type="ordered" withPadding my="xs">
        {renderBlocks(block.children as BlockWithChildren[])}
      </List>
    ) : null;

  return (
    <List.Item>
      {block.numbered_list_item.rich_text.map((text, i) => (
        <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
      ))}
      {childContent}
    </List.Item>
  );
};
