import { makeTranslationHook } from "./helpers/makeTranslationHook";

function omitLeadingSlash(v: string): string {
  if (v.startsWith("/")) {
    return v.substring(1);
  }

  return v;
}

const useBaseUrl = makeTranslationHook({
  en: "https://docs.ente.app/en/",
  de: "https://docs.ente.app/de/",
});

export function useDocsLink(page: string) {
  const baseUrl = useBaseUrl();
  return baseUrl + omitLeadingSlash(page);
}
