import React from "react";
import { List } from "@mantine/core";
import { BulletedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { renderRichText } from "./Paragraph";

export const BulletedListItem = ({
  block,
  index,
}: {
  block: BulletedListItemBlockObjectResponse;
  index: number;
}) => {
  return (
    <List key={index} withPadding>
      <List.Item>
        {block.bulleted_list_item.rich_text.map((text, i) => (
          <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
        ))}
      </List.Item>
    </List>
  );
};
