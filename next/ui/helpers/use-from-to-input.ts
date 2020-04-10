import * as React from "react";
import * as _ from "lodash";

export const useFromToInput = (
  defaultFrom: number,
  defaultTo: number,
  disableCorrection = false
) => {
  const [from, setFrom] = React.useState<number | undefined>(defaultFrom);
  const [to, setTo] = React.useState<number | undefined>(defaultTo);

  const handleSetFrom = React.useCallback(
    (v: number | undefined) => {
      if (_.isUndefined(v)) {
        setFrom(v);
        return;
      }

      if (v < 0 || v > 12) {
        return;
      }

      setFrom(v);

      if (!_.isUndefined(to) && v > to) {
        setTo(v + 1);
      }
    },
    [from, setFrom, to, setTo]
  );

  const handleSetTo = React.useCallback(
    (v: number | undefined) => {
      if (_.isUndefined(v)) {
        setTo(v);
        return;
      }

      if (v < 0 || v > 12) {
        return;
      }

      setTo(v);

      if (!_.isUndefined(from) && v < from) {
        setFrom(v);
      }
    },
    [from, setFrom, to, setTo]
  );

  return {
    from,
    to,
    setFrom: disableCorrection ? setFrom : handleSetFrom,
    setTo: disableCorrection ? setTo : handleSetTo
  };
};
