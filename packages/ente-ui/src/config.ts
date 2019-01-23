/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import * as cookie from "./cookie";
import * as localStorage from "./localStorage";
import { Some, None } from "monet";
import * as _ from "lodash";
const pack = require("../package.json");

const SECOND = 1000;
const MINUTE = 60 * SECOND;

type Config = {
  SENTRY_DSN?: string;
  ROTATION_PERIOD: number;
  ALLOW_INSECURE: boolean;
  VERSION: string;
};

const CONFIG_COOKIE = "_config";
const LOCAL_STORAGE_CONFIG_KEY = "CONFIG";

const fromUriEncoding = (s: string) => decodeURIComponent(s);

const getConfig = (): any => {
  const c = cookie
    .get(CONFIG_COOKIE)
    .orElse(localStorage.get(LOCAL_STORAGE_CONFIG_KEY))
    .orSome("{}");

  localStorage.set(LOCAL_STORAGE_CONFIG_KEY, c);
  return JSON.parse(c);
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

const readConfig = (): Config => {
  const c = getConfig();

  const { SENTRY_DSN } = c;

  const instanceInfoDe = (isSet(c.INSTANCE_INFO_DE)
    ? Some(c.INSTANCE_INFO_DE)
    : None()
  ).map(fromUriEncoding);
  const instanceInfoEn = (isSet(c.INSTANCE_INFO_EN)
    ? Some(c.INSTANCE_INFO_EN)
    : None()
  ).map(fromUriEncoding);

  return {
    ROTATION_PERIOD: !!c.ROTATION_PERIOD
      ? c.ROTATION_PERIOD * 1000
      : 5 * MINUTE,
    SENTRY_DSN: SENTRY_DSN !== "undefined" ? SENTRY_DSN : undefined,
    ALLOW_INSECURE: c.ALLOW_INSECURE === "true",
    VERSION: pack.version as string
  };
};

let config: Config | null = null;

export const get = () => {
  if (!config) {
    config = readConfig();
  }

  return config!;
};
