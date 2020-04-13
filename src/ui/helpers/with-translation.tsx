import * as React from "react";
import { ByLanguage } from "@@types";
import { makeTranslationHook } from "./makeTranslationHook";

export type WithTranslation<V> = { translation: V };

export function withTranslation<V>(translation: ByLanguage<V>) {
  const useTranslation = makeTranslationHook(translation);

  return function <P>(
    Component: React.ComponentType<P & WithTranslation<V>>
  ): React.FunctionComponent<P> {
    return (props: P) => {
      const translation = useTranslation();
      return <Component {...props} translation={translation} />;
    };
  };
}
