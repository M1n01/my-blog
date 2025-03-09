import React from "react";
import { List } from "@mantine/core";
import { BulletedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { renderRichText } from "./Paragraph";

export const BulletedListItem = ({
  block,
}: {
  block: BulletedListItemBlockObjectResponse;
}) => {
  return (
    <List.Item>
      {block.bulleted_list_item.rich_text.map((text, i) => (
        <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
      ))}
    </List.Item>
  );
};
