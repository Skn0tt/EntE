import * as React from "react";
import { StoreContext } from "./store-context";
import { getLanguage } from "../redux";
import { Languages, DEFAULT_LANGUAGE } from "ente-types";

export const useLanguage = (): Languages => {
  const store = React.useContext(StoreContext);
  const state = store.getState();
  const language = getLanguage(state).orSome(DEFAULT_LANGUAGE);
  return language;
};
