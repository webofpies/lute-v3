import { ActionIcon, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import DictTabEmbedded from "../DictTab/DictTabEmbedded";
import DictTabExternal from "../DictTab/DictTabExternal";

function DictDropdown({ term, dicts, onClick }) {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon
          variant="transparent"
          mr="auto"
          ml="xs"
          style={{ alignSelf: "center" }}>
          <IconChevronDown />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {dicts.map((dict) =>
          dict.isExternal ? (
            <DictTabExternal
              key={dict.label}
              dict={dict}
              term={term}
              component={Menu.Item}
            />
          ) : (
            <DictTabEmbedded
              key={dict.label}
              dict={dict}
              value={String("dropdownTab")}
              onClick={() => onClick(dict.url)}
              component={Menu.Item}
            />
          )
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

export default DictDropdown;
