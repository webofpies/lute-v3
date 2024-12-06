import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  CloseButton,
  Combobox,
  InputBase,
  rem,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";

// https://mantine.dev/combobox/?e=SelectAsync
let languages = [];
let allLanguages = [];

export function LanguageSelect({ predefined }) {
  const [params, setParams] = useSearchParams();
  const { pathname } = useLocation();
  const definedLang = params.get("def");
  const openedFromLanguages = pathname === "/languages";

  languages = [
    {
      label: "Create from predefined",
      options: predefined,
      // id: "predefined",
    },
  ];

  allLanguages = languages.reduce(
    (acc, group) => [...acc, ...group.options],
    []
  );

  // const [data, setData] = useState(allLanguages);
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    definedLang && openedFromLanguages && setSearch(definedLang);
  }, [definedLang, openedFromLanguages]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const shouldFilterOptions = allLanguages.every((item) => item !== search);
  const filteredGroups = languages.map((group) => {
    const filteredOptions = shouldFilterOptions
      ? group.options.filter((item) =>
          item.toLowerCase().includes(search.toLowerCase().trim())
        )
      : group.options;

    return { ...group, options: filteredOptions };
  });

  const matchedOptionsCount = filteredGroups.reduce(
    (acc, group) => acc + group.options.length,
    0
  );

  const groups = filteredGroups.map((group) => {
    const options = group.options.map((item) => {
      return (
        <Combobox.Option value={item} key={item}>
          {item}
        </Combobox.Option>
      );
    });

    return (
      <Combobox.Group label={group.label} key={group.label}>
        {options}
      </Combobox.Group>
    );
  });

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === "$create") {
          // setData((current) => [...current, search]);
          setValue(search);
        } else {
          setValue(val);
          setSearch(val);
          setParams({ predef: val });
        }

        combobox.closeDropdown();
      }}>
      <Combobox.Target>
        <InputBase
          mb={rem(10)}
          w="fit-content"
          label="Name"
          leftSection={<IconLanguage />}
          rightSection={
            value !== null ? (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setSearch("");
                  setValue(null);
                }}
                aria-label="Clear value"
              />
            ) : (
              <Combobox.Chevron />
            )
          }
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || "");
          }}
          placeholder="Pick predefined or create new"
          rightSectionPointerEvents={value === null ? "none" : "all"}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={400} type="scroll">
            {groups}
            {matchedOptionsCount === 0 && search.trim().length > 0 && (
              <Combobox.Option value="$create">
                + Create {search}
              </Combobox.Option>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default LanguageSelect;
