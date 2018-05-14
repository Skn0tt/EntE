/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 * 
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

interface Config {
  production: boolean;
  host: string;
  DSN?: string;
  smtp: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
}

let config: Config | null = null;

export const createFromEnv = () => {
  const env: Config = {
    host: process.env.HOST!,
    production: process.env.NODE_ENV === "production",
    DSN: process.env.SENTRY_DSN_API,
    smtp: {
      host: process.env.SMTP_HOST!,
      port: +process.env.SMTP_PORT!,
      user: process.env.SMTP_USER!,
      password: process.env.SMTP_PASSWORD!
    }
  };

  config = env;
};

export const getConfig = () => {
  if (!config) {
    createFromEnv();
  }
  return config!;
};

export default { getConfig };
