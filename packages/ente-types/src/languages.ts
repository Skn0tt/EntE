export enum Languages {
  ENGLISH = "en",
  GERMAN = "de"
}

export const languagesArr = Object.keys(Languages).map(
  f => Languages[f as any] as Languages
);

export const isValidLanguage = (v: string): v is Languages =>
  (languagesArr as string[]).includes(v);

export type ByLanguage<T> = { [TKey in Languages]: T };

export const getByLanguage = <T>(values: ByLanguage<T>) => (lang: Languages) =>
  values[lang];

export const DEFAULT_LANGUAGE = Languages.ENGLISH;
