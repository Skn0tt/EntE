import { Provider } from "react-redux";
import { createStore } from "redux";
import { initialState } from "ui/redux/reducer";
import { useMemo } from "react";

export function TestWrapper(props: React.PropsWithChildren<{}>) {
  const { children } = props;
  const store = useMemo(() => createStore(() => initialState), []);

  return <Provider store={store}>{children}</Provider>;
}
