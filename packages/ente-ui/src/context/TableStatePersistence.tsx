import * as React from "react";

type TableState = any;
type TableStatePersistenceContextPayload = Record<string, TableState>;
interface TableStatePersistenceContextType {
  currentValue: TableStatePersistenceContextPayload;
  update(key: string, payload: TableState): void;
}
const TableStatePersistenceContext = React.createContext<
  TableStatePersistenceContextType
>({
  currentValue: {},
  update: () => {}
});

export function useTableStatePersistence(
  key: string
): [TableState | undefined, (newState: TableState) => void] {
  const { update, currentValue } = React.useContext(
    TableStatePersistenceContext
  );

  const u = React.useCallback(
    (p: TableState) => {
      update(key, p);
    },
    [update, key]
  );

  return [currentValue[key], u];
}

export const TableStatePersistenceProvider: React.FC = props => {
  const { children } = props;

  const [currentValue, setCurrentValue] = React.useState<
    TableStatePersistenceContextPayload
  >({});
  const update = React.useCallback(
    (key: string, payload: TableStatePersistenceContextPayload) => {
      setCurrentValue(v => ({ ...v, [key]: payload }));
    },
    [setCurrentValue]
  );

  const value = React.useMemo(() => ({ currentValue, update }), [
    currentValue,
    update
  ]);

  return (
    <TableStatePersistenceContext.Provider value={value}>
      {children}
    </TableStatePersistenceContext.Provider>
  );
};
