import * as React from "react";

export const useToggle = (defaultValue: boolean): [boolean, () => void] => {
  const [value, set] = React.useState<boolean>(defaultValue);

  const toggle = () => set(!value);

  return [value, toggle];
};
