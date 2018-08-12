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

const SECOND = 1000;
const MINUTE = 60 * SECOND;

type Config = {
  SENTRY_DSN_UI?: string;
  ROTATION_PERIOD: number;
  ALLOW_INSECURE: boolean;
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

const readConfig = () => {
  const c = getConfig();

  config = {
    ROTATION_PERIOD: !!c.ROTATION_PERIOD
      ? c.ROTATION_PERIOD * 1000
      : 5 * MINUTE,
    SENTRY_DSN_UI: c.SENTRY_DSN_UI,
    ALLOW_INSECURE: c.ALLOW_INSECURE === "true"
  };
};

export const get = () => {
  if (!config) {
    readConfig();
  }

  return config!;
};
