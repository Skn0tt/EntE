import * as React from "react";
import { Languages } from "@@types";
import { useLanguage } from "./useLanguage";

export type WithLanguage = { language: Languages };

export function withLanguage<P>(
  Component: React.ComponentType<P & WithLanguage>
): React.ComponentType<P> {
  return (props: P) => {
    const language = useLanguage();

    return <Component {...props} language={language} />;
  };
}
