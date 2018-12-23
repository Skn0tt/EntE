import * as React from "react";
import { AppState } from "../redux";
import { Store } from "redux";

export const StoreContext = React.createContext<Store<AppState>>(
  (null as unknown) as Store<AppState>
);
