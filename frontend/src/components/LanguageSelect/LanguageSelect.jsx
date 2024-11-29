import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CloseButton,
  Combobox,
  InputBase,
  Loader,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";

// https://mantine.dev/combobox/?e=SelectAsync
let languages = [];
let allLanguages = [];

export function LanguageSelect() {
  const predefinedQuery = useQuery({
    queryKey: ["predefined"],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/languages/predefined`
      );
      return await response.json();
    },
    staleTime: Infinity,
    enabled: false,
  });

  const definedQuery = useQuery({
    queryKey: ["defined"],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:5001/api/languages/defined`
      );
      return await response.json();
    },
    staleTime: Infinity,
    enabled: false,
  });

  if (definedQuery.data && predefinedQuery.data) {
    languages = [
      {
        label: "Edit existing",
        options: [...definedQuery.data.map((obj) => obj.name)],
      },
      { label: "Create from predefined", options: predefinedQuery.data },
    ];

    allLanguages = languages.reduce(
      (acc, group) => [...acc, ...group.options],
      []
    );
  }

  // const [data, setData] = useState(allLanguages);
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState("");

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => {
      // if (data.length === 0) {
      if (!predefinedQuery.data && !predefinedQuery.isLoading) {
        predefinedQuery.refetch(); // Manually trigger refetch
      }
      if (!definedQuery.data && !definedQuery.isLoading) {
        definedQuery.refetch(); // Manually trigger refetch
      }
      predefinedQuery.data &&
        definedQuery.data &&
        combobox.resetSelectedOption();
      // }
    },
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
    const options = group.options.map((item) => (
      <Combobox.Option value={item} key={item}>
        {item}
      </Combobox.Option>
    ));

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
        }

        combobox.closeDropdown();
      }}>
      <Combobox.Target>
        <InputBase
          label="Name"
          leftSection={<IconLanguage />}
          rightSection={
            predefinedQuery.isLoading || definedQuery.isLoading ? (
              <Loader size={18} />
            ) : value !== null ? (
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
          placeholder="Find or type new name"
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
