import { Image, Popover, UnstyledButton } from "@mantine/core";

function TermImage({ src }) {
  return (
    <Popover position="left">
      <Popover.Target>
        <UnstyledButton>
          <Image radius={5} w={50} h={50} src={src} />
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p={0}>
        <Image mah="200px" src={src} />
      </Popover.Dropdown>
    </Popover>
  );
}

export default TermImage;
