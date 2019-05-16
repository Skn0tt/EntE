import * as enLocale from "date-fns/locale/en-GB";
import * as deLocale from "date-fns/locale/de";
import { makeTranslationHook } from "./makeTranslationHook";
import { format as _format, parseISO } from "date-fns";

const useTranslation = makeTranslationHook({
  de: deLocale,
  en: enLocale
});

export const useLocalizedDateFormat = () => {
  const locale = useTranslation();

  return (date: number | Date | string, format: string): string => {
    return _format(typeof date === "string" ? parseISO(date) : date, format, {
      locale
    });
  };
};
