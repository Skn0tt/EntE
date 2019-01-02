import * as React from "react";

export const useFromToInput = (defaultFrom: number, defaultTo: number) => {
  const [from, setFrom] = React.useState(defaultFrom);
  const [to, setTo] = React.useState(defaultTo);

  const handleSetFrom = React.useCallback(
    (v: number) => {
      if (v < 0 || v > 12) {
        return;
      }

      setFrom(v);

      if (v > to) {
        setTo(v + 1);
      }
    },
    [from, setFrom, to, setTo]
  );

  const handleSetTo = React.useCallback(
    (v: number) => {
      if (v < 0 || v > 12) {
        return;
      }

      setTo(v);

      if (v < from) {
        setFrom(v);
      }
    },
    [from, setFrom, to, setTo]
  );

  return {
    from,
    to,
    setFrom: handleSetFrom,
    setTo: handleSetTo
  };
};
