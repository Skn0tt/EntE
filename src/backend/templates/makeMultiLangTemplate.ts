import { Languages } from "@@types";
import { mjml2html } from "../helpers/mjml";
import "./register-helpers";

interface Template<T> {
  title: string;
  template: HandlebarsTemplateDelegate<T>;
}

type TemplatesByLanguage<T> = Record<Languages, Template<T>>;

export function makeMultiLangTemplate<T>(templates: TemplatesByLanguage<T>) {
  return function (lang: Languages, payload: T) {
    const { template, title } = templates[lang];
    const mjml = template(payload);
    const { errors, html } = mjml2html(mjml);
    if (errors.length > 0) throw new Error("MJML Error");
    return { html, subject: title };
  };
}
