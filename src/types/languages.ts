export enum Languages {
  ENGLISH = "en",
  GERMAN = "de",
}

export const languagesArr = [Languages.ENGLISH, Languages.GERMAN];

export const isValidLanguage = (v: string): v is Languages =>
  (languagesArr as string[]).includes(v);

export type ByLanguage<T> = { [TKey in Languages]: T };

export const getByLanguage = <T>(values: ByLanguage<T>) => (lang: Languages) =>
  values[lang];

export const DEFAULT_DEFAULT_LANGUAGE = Languages.ENGLISH;
