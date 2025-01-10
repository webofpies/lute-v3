import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PillsInput,
  Pill,
  Combobox,
  useCombobox,
  Text,
  Loader,
  ScrollArea,
  CloseButton,
} from "@mantine/core";
import { termSuggestionsQuery } from "../../queries/term";
import { buildSuggestionsList } from "../../misc/utils";

const MAX_SUGGESTION_COUNT = 15;

function TagsField({ form, languageId, onSetActiveTerm }) {
  const {
    handleKeydown,
    handleInputChange,
    handleTagClick,
    handleOptionSubmit,
    handleOnBlur,
    handleValueRemove,
    inputRightSection,
    combobox,
    search,
    options,
    suggestions,
  } = useInitializeTagsField(form, languageId, onSetActiveTerm);

  return (
    <Combobox
      withinPortal={false}
      store={combobox}
      onOptionSubmit={handleOptionSubmit}>
      <Combobox.DropdownTarget>
        <PillsInput rightSection={inputRightSection}>
          <Pill.Group gap={4}>
            {form.getValues().parents.map((item) => (
              <Pill
                key={item}
                style={{ cursor: "pointer" }}
                withRemoveButton
                onClick={() => handleTagClick(item)}
                onRemove={() => handleValueRemove(item)}>
                {item}
              </Pill>
            ))}
            <Combobox.EventsTarget>
              <PillsInput.Field
                value={decodeURIComponent(search)}
                placeholder="Parents"
                onChange={handleInputChange}
                onKeyDown={handleKeydown}
                onBlur={handleOnBlur}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      {suggestions && options.length > 0 && (
        <Combobox.Dropdown tabIndex={0}>
          <Combobox.Options>
            <ScrollArea.Autosize mah={200} type="scroll">
              {options.map((item) => (
                <Combobox.Option
                  value={JSON.stringify(item)}
                  key={item.suggestion}
                  active={form.getValues().parents.includes(item.suggestion)}>
                  <span>{item.suggestion}</span>
                </Combobox.Option>
              ))}
            </ScrollArea.Autosize>
          </Combobox.Options>
          {suggestions.length > MAX_SUGGESTION_COUNT && (
            <Combobox.Footer>
              <Text c="dimmed" size="xs" fs="italic">
                (more items available, please refine your search.)
              </Text>
            </Combobox.Footer>
          )}
        </Combobox.Dropdown>
      )}
    </Combobox>
  );
}

function useInitializeTagsField(form, languageId, onSetActiveTerm) {
  let suggestions;
  const [search, setSearch] = useState("");

  const { data, isFetching } = useQuery(
    termSuggestionsQuery(search, languageId)
  );

  if (data) {
    suggestions = buildSuggestionsList(form.getValues().originalText, data);
  }

  const options = suggestions
    ? suggestions
        .slice(0, MAX_SUGGESTION_COUNT)
        .filter((item) =>
          item.suggestion.toLowerCase().includes(search.trim().toLowerCase())
        )
        .filter((item) => !form.getValues().parents.includes(item.value))
    : [];

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  // console.log(suggestions);

  // const handleValueSelect = (val) =>
  //   setValue((current) =>
  //     current.includes(val)
  //       ? current.filter((v) => v !== val)
  //       : [...current, val]
  //   );

  const handleValueAdd = (val) => {
    if (val && val !== " ") {
      const currentParents = form.getValues().parents;
      form.setFieldValue("parents", [...currentParents, val]);
    }
  };

  const handleValueRemove = (val) => {
    const newValues = form.getValues().parents.filter((v) => v !== val);
    form.setFieldValue("parents", newValues);
  };

  function handleKeydown(event) {
    if (event.key === "Backspace" && search.length === 0) {
      event.preventDefault();
      const parents = form.getValues().parents;
      handleValueRemove(parents[parents.length - 1]);
    }

    if (event.key === "Enter") {
      event.preventDefault();
      // alert(combobox.getSelectedOptionIndex());
      if (combobox.getSelectedOptionIndex() === -1) {
        handleValueAdd(event.currentTarget.value);
        combobox.closeDropdown();
      } else {
        // handleValueAdd(event.currentTarget.value);
      }
      setSearch("");
    }
  }

  function handleInputChange(event) {
    const val = event.currentTarget.value;
    val ? combobox.openDropdown() : combobox.closeDropdown();
    combobox.updateSelectedOptionIndex();
    setSearch(val);
  }

  function handleTagClick(item) {
    languageId &&
      onSetActiveTerm({
        data: item,
        langID: languageId,
        type: "multi",
      });
  }

  function handleOptionSubmit(val) {
    const obj = JSON.parse(val);

    const newValues = [...form.getValues().parents, obj.value];
    const singleParent = newValues.length === 1;

    if (singleParent) {
      form.setFieldValue("status", String(obj.status));
    }
    form.setFieldValue("syncStatus", singleParent);
    form.setFieldValue("parents", newValues);

    setSearch("");

    combobox.closeDropdown();
  }

  function handleOnBlur(event) {
    handleValueAdd(event.currentTarget.value);
    combobox.closeDropdown();
    setSearch("");
  }

  const inputRightSection = form.getValues().parents.length ? (
    <CloseButton
      size="sm"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => form.setFieldValue("parents", [])}
      aria-label="Clear value"
    />
  ) : (
    isFetching && <Loader size="sm" />
  );

  return {
    handleKeydown,
    handleInputChange,
    handleTagClick,
    handleOptionSubmit,
    handleOnBlur,
    handleValueRemove,
    inputRightSection,
    combobox,
    search,
    options,
    suggestions,
  };
}

export default TagsField;
