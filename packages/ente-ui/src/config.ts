/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import * as cookie from "./cookie";
import * as localStorage from "./localStorage";
import { Some, None, Maybe } from "monet";
import { Languages } from "./helpers/createTranslation";
import * as _ from "lodash";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

type Config = {
  SENTRY_DSN_UI?: string;
  ROTATION_PERIOD: number;
  ALLOW_INSECURE: boolean;
  LANGUAGE: Languages;
  INSTANCE_INFO_DE: Maybe<string>;
  INSTANCE_INFO_EN: Maybe<string>;
};

let config: Config | null = null;

const CONFIG_COOKIE = "_config";
const LOCAL_STORAGE_CONFIG_KEY = "CONFIG";

const fromUriEncoding = (s: string) => decodeURI(s);

const getConfig = (): any => {
  const c = cookie
    .get(CONFIG_COOKIE)
    .orElse(localStorage.get(LOCAL_STORAGE_CONFIG_KEY))
    .orSome("{}");

  localStorage.set(LOCAL_STORAGE_CONFIG_KEY, c);
  console.log(c);
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

const NULL_VALUES = ["<Nil>", "<nil>", ""];

const isSet = (s?: string): boolean => {
  if (_.isUndefined(s)) {
    return false;
  }
  if (NULL_VALUES.includes(s)) {
    return false;
  }

  return true;
};

const readConfig = () => {
  const c = getConfig();

  const { SENTRY_DSN_UI } = c;

  const instanceInfoDe = (isSet(c.INSTANCE_INFO_DE)
    ? Some(c.INSTANCE_INFO_DE)
    : None()
  ).map(fromUriEncoding);
  const instanceInfoEn = (isSet(c.INSTANCE_INFO_EN)
    ? Some(c.INSTANCE_INFO_EN)
    : None()
  ).map(fromUriEncoding);

  config = {
    ROTATION_PERIOD: !!c.ROTATION_PERIOD
      ? c.ROTATION_PERIOD * 1000
      : 5 * MINUTE,
    INSTANCE_INFO_DE: instanceInfoDe,
    INSTANCE_INFO_EN: instanceInfoEn,
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
