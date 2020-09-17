import * as React from "react";
import MuiDownshift from "mui-downshift";
import { useMemo } from "react";

interface SearchableDropdownProps<T> {
  items: ReadonlyArray<T>;
  value: string;
  onChange: (v: string) => void;
  onSelect?: (v: T | undefined) => void;
  itemToString: (v: T) => string;
  includeItem: (item: T, searchTerm: string) => boolean;
  label?: string;
  helperText?: string;
}

export function SearchableDropdown<T>(props: SearchableDropdownProps<T>) {
  const {
    itemToString,
    onChange,
    label,
    helperText,
    value,
    onSelect,
    items,
    includeItem,
  } = props;

  const filteredItems = useMemo(() => {
    return items.filter((item) => includeItem(item, value));
  }, [value, includeItem, items]);

  const itemsToShow = filteredItems.map((i) => ({
    value: i,
    label: itemToString(i),
  }));

  return (
    <MuiDownshift
      inputValue={value}
      onInputValueChange={onChange}
      items={itemsToShow}
      onChange={(selection: { value: T } | undefined) => {
        onSelect?.(!!selection ? selection.value : undefined);
      }}
      getInputProps={() => ({ label, helperText })}
    />
  );
}
