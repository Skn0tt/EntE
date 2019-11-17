import * as React from "react";
import * as _ from "lodash";

type KeyValueStorage = Record<string, any>;
interface KeyValueStorageContextType {
  currentValue: KeyValueStorage;
  update(key: string, payload: React.SetStateAction<any>): void;
}
const KeyValueStorageContext = React.createContext<KeyValueStorageContextType>({
  currentValue: {},
  update: () => {}
});

export function useKeyValueStorage<T>(
  key: string
): [T | undefined, (newState: React.SetStateAction<T>) => void] {
  const { update, currentValue } = React.useContext(KeyValueStorageContext);

  const u = React.useCallback(
    (p: React.SetStateAction<T>) => {
      update(key, p);
    },
    [update, key]
  );

  return [currentValue[key] as T, u];
}

export const KeyValueStorageProvider: React.FC = props => {
  const { children } = props;

  const [currentValue, setCurrentValue] = React.useState<KeyValueStorage>({});
  const update = React.useCallback(
    (key: string, payload: React.SetStateAction<any>) => {
      setCurrentValue(state => {
        const v = state[key];
        const newValue = _.isFunction(payload) ? payload(v) : payload;
        return {
          ...state,
          [key]: newValue
        };
      });
    },
    [setCurrentValue]
  );

  const value = React.useMemo(() => ({ currentValue, update }), [
    currentValue,
    update
  ]);

  return (
    <KeyValueStorageContext.Provider value={value}>
      {children}
    </KeyValueStorageContext.Provider>
  );
};
