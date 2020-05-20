import { makeTranslationHook } from "./helpers/makeTranslationHook";

function omitLeadingSlash(v: string): string {
  if (v.startsWith("/")) {
    return v.substring(1);
  }

  return v;
}

function appendTrailingDotHTML(v: string): string {
  if (v.endsWith(".html")) {
    return v;
  }

  return v + ".html";
}

const useBaseUrl = makeTranslationHook({
  en: "https://docs.ente.app/en/",
  de: "https://docs.ente.app/de/",
});

export function useDocsLink(page: string) {
  const baseUrl = useBaseUrl();
  return baseUrl + appendTrailingDotHTML(omitLeadingSlash(page));
}
