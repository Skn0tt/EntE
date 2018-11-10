/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import * as cookie from "./cookie";
import * as localStorage from "./localStorage";
import { Some } from "monet";
import { Languages } from "./helpers/createTranslation";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

type Config = {
  SENTRY_DSN_UI?: string;
  ROTATION_PERIOD: number;
  ALLOW_INSECURE: boolean;
  LANGUAGE: Languages;
};

let config: Config | null = null;

const CONFIG_COOKIE = "_config";
const LOCAL_STORAGE_CONFIG_KEY = "CONFIG";

const getConfig = (): any => {
  const c = cookie
    .get(CONFIG_COOKIE)
    .orElse(localStorage.get(LOCAL_STORAGE_CONFIG_KEY))
    .orElse(Some("{}"))
    .some();

  localStorage.set(LOCAL_STORAGE_CONFIG_KEY, c);
  return JSON.parse(c);
};

const getLanguage = (lang: string): Languages => {
  switch (lang) {
    case "en":
      return Languages.ENGLISH;
    case "de":
      return Languages.GERMAN;
    default:
      return Languages.ENGLISH;
  }
};

const readConfig = () => {
  const c = getConfig();

  const { SENTRY_DSN_UI } = c;

  config = {
    ROTATION_PERIOD: !!c.ROTATION_PERIOD
      ? c.ROTATION_PERIOD * 1000
      : 5 * MINUTE,
    SENTRY_DSN_UI: SENTRY_DSN_UI !== "undefined" ? SENTRY_DSN_UI : undefined,
    ALLOW_INSECURE: c.ALLOW_INSECURE === "true",
    LANGUAGE: getLanguage(c.LANG)
  };
};

export const get = () => {
  if (!config) {
    readConfig();
  }

  return config!;
};
