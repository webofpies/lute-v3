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

function TagsField({ form, tags, book, activeTermText, onSetActiveTerm }) {
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
    values,
    options,
    suggestions,
  } = useInitializeTagsField(form, book, tags, onSetActiveTerm, activeTermText);

  return (
    <Combobox
      withinPortal={false}
      store={combobox}
      onOptionSubmit={handleOptionSubmit}>
      <Combobox.DropdownTarget>
        <PillsInput rightSection={inputRightSection}>
          <Pill.Group gap={4}>
            {values.map((item) => (
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
                  active={values.includes(item.suggestion)}>
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

function useInitializeTagsField(
  form,
  book,
  tags,
  onSetActiveTerm,
  activeTermText
) {
  let suggestions;
  const [search, setSearch] = useState("");
  const [values, setValues] = useState(tags);

  const { data, isFetching } = useQuery(
    termSuggestionsQuery(search, book.languageId)
  );

  if (data) {
    suggestions = buildSuggestionsList(activeTermText, data);
  }

  const options = suggestions
    ? suggestions
        .slice(0, MAX_SUGGESTION_COUNT)
        .filter((item) =>
          item.suggestion.toLowerCase().includes(search.trim().toLowerCase())
        )
        .filter((item) => !values.includes(item.value))
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
    val && val !== " " && setValues((current) => [...current, val]);
  };

  const handleValueRemove = (val) =>
    setValues((current) => {
      const newValues = current.filter((v) => v !== val);
      form.setFieldValue("parents", newValues);
      return newValues;
    });

  function handleKeydown(event) {
    if (event.key === "Backspace" && search.length === 0) {
      event.preventDefault();
      handleValueRemove(values[values.length - 1]);
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
    book.languageId &&
      onSetActiveTerm({
        data: item,
        langID: book.languageId,
        type: "multi",
      });
  }

  function handleOptionSubmit(val) {
    const obj = JSON.parse(val);
    const v = obj.value;
    setValues((current) => {
      const newValues = [...current, v];
      const singleParent = newValues.length === 1;

      if (singleParent) {
        form.setFieldValue("status", String(obj.status));
      }
      form.setFieldValue("syncStatus", singleParent);
      form.setFieldValue("parents", newValues);

      return newValues;
    });
    setSearch("");

    combobox.closeDropdown();
  }

  function handleOnBlur(event) {
    handleValueAdd(event.currentTarget.value);
    combobox.closeDropdown();
    setSearch("");
  }

  const inputRightSection = values.length ? (
    <CloseButton
      size="sm"
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => setValues([])}
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
    values,
    options,
    suggestions,
  };
}

export default TagsField;
