export enum Languages {
  ENGLISH = "en",
  GERMAN = "de"
}

export type ByLanguage<T> = { [TKey in Languages]: T };

export const getByLanguage = <T>(values: ByLanguage<T>) => (lang: Languages) =>
  values[lang];
