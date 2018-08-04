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
  signerHost: string;
  railmailHost: string;
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}

let config: Config | null = null;

export const createFromEnv = () => {
  const env: Config = {
    host: process.env.HOST!,
    production: process.env.NODE_ENV === "production",
    DSN: process.env.SENTRY_DSN_API,
    signerHost: process.env.SIGNER_HOST,
    railmailHost: process.env.RAILMAIL_HOST,
    db: {
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
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
