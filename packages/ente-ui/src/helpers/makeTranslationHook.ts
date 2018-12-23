import { ByLanguage, getByLanguage } from "ente-types";
import { useLanguage } from "./useLanguage";

export const makeTranslationHook = <T>(v: ByLanguage<T>) => {
  const getTranslation = getByLanguage(v);

  return () => {
    const language = useLanguage();
    return getTranslation(language);
  };
};
