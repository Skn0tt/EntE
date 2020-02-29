import * as React from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as _ from "lodash";

interface ClassPickerProps {
  onChange: (_class: string) => void;
  value: string;
  availableClasses: string[];
  label: string;
}

export const ClassPicker: React.SFC<ClassPickerProps> = props => {
  const { value, onChange, availableClasses, label } = props;

  return (
    <Autocomplete
      freeSolo
      options={availableClasses}
      value={value}
      onChange={(e: any) => {
        console.log(e);
        onChange("" + e);
      }}
      renderInput={params => (
        <TextField {...params} label={label} SelectProps={{ native: true }} />
      )}
    />
  );
};

/*

    
    <TextField
      select
      label={label}
      value={value}
      fullWidth
      onChange={e => onChange(e.target.value)}
      SelectProps={{ native: true }}
    >
      {_.uniq(availableClasses).map(c => (
        <option key={c} value={c}>
          {"" + c}
        </option>
      ))}
    </TextField>
*/
