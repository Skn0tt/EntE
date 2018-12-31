import { Maybe, None, Some } from "monet";
import { ensureNotEnding } from "./ensure-not-ending";
import { Languages } from "ente-types";
import * as _ from "lodash";
const pack = require("../../package.json");

interface IConfig {
  production: boolean;
  baseUrl: string;
  DSN: Maybe<string>;
  signerBaseUrl: string;
  version: string;
  defaultLanguage: Languages;
  mail: {
    address: string;
    sender: string;
    host: string;
    port: number;
    username: string;
    password: string;
    pool: boolean;
  };
  cron: {
    enable: boolean;
    weeklySummary: string;
  };
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    timezone: string;
  };
  redis: {
    host: string;
    port: number;
    prefix: string;
  };
}

const config = ((): Readonly<IConfig> => {
  const envVars = process.env;
  const {
    BASE_URL,
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PREFIX,
    ENABLE_CRON_JOBS,
    CRON_WEEKLY_SUMMARY,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SMTP_SENDER,
    SMTP_POOL,
    SMTP_ADDRESS,
    DEFAULT_LANGUAGE,
    SENTRY_DSN
  } = envVars;
  return {
    baseUrl: ensureNotEnding("/")(BASE_URL!),
    production: envVars.NODE_ENV === "production",
    defaultLanguage: DEFAULT_LANGUAGE as Languages,
    cron: {
      enable: ENABLE_CRON_JOBS === "true",
      weeklySummary: CRON_WEEKLY_SUMMARY!
    },
    DSN: Maybe.fromUndefined(SENTRY_DSN).filter(s => s !== "<nil>"),
    version: pack.version,
    signerBaseUrl: envVars.SIGNER_BASEURL!,
    mail: {
      address: SMTP_ADDRESS!,
      host: SMTP_HOST!,
      port: +SMTP_PORT!,
      password: SMTP_PASSWORD!,
      sender: SMTP_SENDER!,
      username: SMTP_USERNAME!,
      pool: SMTP_POOL === "false" ? false : true
    },
    db: {
      host: envVars.MYSQL_HOST!,
      port: +envVars.MYSQL_PORT!,
      username: envVars.MYSQL_USERNAME!,
      password: envVars.MYSQL_PASSWORD!,
      database: envVars.MYSQL_DATABASE!,
      timezone: envVars.MYSQL_TIMEZONE!
    },
    redis: {
      host: REDIS_HOST!,
      port: +REDIS_PORT!,
      prefix: REDIS_PREFIX || "ENTE_API_"
    }
  };
})();

const getRedisConfig = () => config.redis;

const getDefaultLanguage = () => config.defaultLanguage;

const isDevMode = () => !config.production;

const isProduction = () => config.production;

const getMysqlConfig = () => config.db;

const getBaseUrl = () => config.baseUrl;

const getSentryDsn = () => config.DSN;

const getConfig = () => config;

const isCronEnabled = () => config.cron.enable;

const getWeeklySummaryCron = () => config.cron.weeklySummary;

const getSignerBaseUrl = () => config.signerBaseUrl;

const getVersion = () => config.version;

const getMailConfig = () => config.mail;

export const Config = {
  getRedisConfig,
  isDevMode,
  isProduction,
  getMailConfig,
  getMysqlConfig,
  getBaseUrl,
  getSentryDsn,
  getConfig,
  isCronEnabled,
  getWeeklySummaryCron,
  getSignerBaseUrl,
  getVersion,
  getDefaultLanguage
};
