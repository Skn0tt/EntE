import * as React from "react";
import MuiDownshift from "mui-downshift";
import { Maybe } from "monet";

interface SearchableDropdownProps<T> {
  items: ReadonlyArray<T>;
  onChange: (v: Maybe<T>) => void;
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
    filteredItems: this.props.items
  };

  handleStateChange = changes => {
    const { items, includeItem } = this.props;
    if (changes.type === "__autocomplete_change_input__") {
      const filteredItems = items.filter(i =>
        includeItem(i, changes.inputValue)
      );
      this.setState({ filteredItems });
    }
  };

  render() {
    const { itemToString, onChange, label, helperText } = this.props;
    const { filteredItems } = this.state;

    const itemsToShow = filteredItems.map(i => ({
      value: i,
      label: itemToString(i)
    }));

    return (
      <MuiDownshift
        items={itemsToShow}
        onChange={selection =>
          onChange(Maybe.fromNull(selection).map(s => s.value))
        }
        onStateChange={this.handleStateChange}
        getInputProps={() => ({ label, helperText })}
      />
    );
  }
}
