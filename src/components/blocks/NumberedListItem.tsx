import React from "react";
import { List } from "@mantine/core";
import { NumberedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { renderRichText } from "./Paragraph";

export const NumberedListItem = ({
  block,
  index,
}: {
  block: NumberedListItemBlockObjectResponse;
  index: number;
}) => {
  return (
    <List key={index} type="ordered" withPadding>
      <List.Item>
        {block.numbered_list_item.rich_text.map((text, i) => (
          <React.Fragment key={i}>{renderRichText(text)}</React.Fragment>
        ))}
      </List.Item>
    </List>
  );
};
