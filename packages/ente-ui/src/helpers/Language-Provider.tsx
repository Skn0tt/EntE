import * as React from "react";
import { Languages } from "ente-types";
import { useLanguage } from "./useLanguage";

interface LanguageProviderProps {
  children: (lang: Languages) => JSX.Element;
}

export const LanguageProvider: React.FunctionComponent<
  LanguageProviderProps
> = props => {
  const { children } = props;
  const lang = useLanguage();
  return children(lang);
};
