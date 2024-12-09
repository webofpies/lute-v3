import { useState, useEffect, memo } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  CloseButton,
  Combobox,
  InputBase,
  ScrollArea,
  useCombobox,
} from "@mantine/core";
import { IconLanguage } from "@tabler/icons-react";

// https://mantine.dev/combobox/?e=SelectAsync
function LanguageSelect({ form, languages }) {
  const [params, setParams] = useSearchParams();
  const { pathname } = useLocation();
  const definedLang = params.get("def");
  const openedFromLanguages = pathname === "/languages";
  const [value, setValue] = useState(null);
  const [search, setSearch] = useState("");

  const shouldFilterOptions = languages.every((item) => item !== search);
  const filteredOptions = shouldFilterOptions
    ? languages.filter((item) =>
        item.toLowerCase().includes(search.toLowerCase().trim())
      )
    : languages;

  useEffect(() => {
    if (definedLang && openedFromLanguages) {
      setSearch(definedLang);
      setValue(definedLang);
    }
  }, [definedLang, openedFromLanguages]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === "$create") {
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
          mb={10}
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
                  form.reset();
                  params.delete("def");
                  params.delete("predef");
                  setParams(params);
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
          placeholder="Create new or from predefined"
          rightSectionPointerEvents={value === null ? "none" : "all"}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={400} type="scroll">
            {filteredOptions.map((item) => (
              <Combobox.Option value={item} key={item}>
                {item}
              </Combobox.Option>
            ))}
            {filteredOptions.length === 0 && search.trim().length > 0 && (
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

export default memo(LanguageSelect);
