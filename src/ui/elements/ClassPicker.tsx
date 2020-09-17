import * as React from "react";
import * as _ from "lodash";
import { SearchableDropdown } from "../components/SearchableDropdown";

interface ClassPickerProps {
  onChange: (_class: string | undefined) => void;
  value: string;
  availableClasses: string[];
  label: string;
}

export function ClassPicker(props: ClassPickerProps) {
  const { value, onChange, availableClasses, label } = props;

  const availableItems = !!value
    ? [...availableClasses, value]
    : availableClasses;

  return (
    <SearchableDropdown<string>
      items={_.uniq(availableItems)}
      includeItem={(item, searchTerm) => item.includes(searchTerm)}
      itemToString={_.identity}
      value={value}
      label={label}
      onChange={onChange}
    />
  );
}
