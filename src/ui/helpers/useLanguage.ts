import * as React from "react";
import { StoreContext } from "./store-context";
import { getLanguage } from "../redux";
import type { Languages } from "@@types";

export const useLanguage = (): Languages => {
  const store = React.useContext(StoreContext);
  const state = store.getState();
  const language = getLanguage(state);
  return language;
};
