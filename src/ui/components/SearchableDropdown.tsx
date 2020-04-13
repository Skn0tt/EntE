import * as React from "react";
import MuiDownshift from "mui-downshift";
import * as _ from "lodash";

interface SearchableDropdownProps<T> {
  items: ReadonlyArray<T>;
  value?: T;
  onChange?: (v: T) => void;
  onSelect?: (v?: T) => void;
  itemToString: (v: T) => string;
  includeItem: (item: T, searchTerm: string) => boolean;
  label?: string;
  helperText?: string;
}

interface SearchableDropdownState<T> {
  filteredItems: ReadonlyArray<T>;
}

export class SearchableDropdown<T> extends React.PureComponent<
  SearchableDropdownProps<T>,
  SearchableDropdownState<T>
> {
  state: SearchableDropdownState<T> = {
    filteredItems: this.props.items,
  };

  handleStateChange = (changes: any) => {
    const { items, includeItem } = this.props;
    if (typeof changes.inputValue === "string") {
      const filteredItems = items.filter((i) =>
        includeItem(i, changes.inputValue)
      );
      this.setState({ filteredItems });
    }
  };

  render() {
    const {
      itemToString,
      onChange,
      label,
      helperText,
      value,
      onSelect = _.noop,
    } = this.props;
    const { filteredItems } = this.state;

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
          onSelect(!!selection ? selection.value : undefined);
        }}
        onStateChange={this.handleStateChange}
        getInputProps={() => ({ label, helperText })}
      />
    );
  }
}
