import { Text, ActionIcon, Group } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";

// export const Likes = ({ likes }: { likes: number }) => {
export const Likes = () => {
  return (
    <Group align="center">
      <ActionIcon variant="outline" c="red" radius="xl">
        <IconHeart size={18} stroke={1.5} />
      </ActionIcon>
      <Text>
        {/* {likes} likes */}
        15
      </Text>
    </Group>
  );
};
