/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as cookie from "js-cookie";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

type Config = {
  SENTRY_DSN_UI?: string;
  ROTATION_PERIOD: number;
};

let config: Config | null = null;

const CONFIG_COOKIE = "_config";

const readConfig = () => {
  const c = cookie.getJSON(CONFIG_COOKIE) as any;

  config = {
    ROTATION_PERIOD: !!c.ROTATION_PERIOD
      ? c.ROTATION_PERIOD * 1000
      : 5 * MINUTE,
    SENTRY_DSN_UI: c.SENTRY_DSN_UI
  };
};

export const get = () => {
  if (!config) {
    readConfig();
  }

  return config!;
};
