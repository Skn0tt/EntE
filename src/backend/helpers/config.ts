import { Maybe } from "monet";
import { ensureNotEnding } from "./ensure-not-ending";
import _ from "lodash";
const pack = require("../../../package.json");

interface IConfig {
  production: boolean;
  baseUrl: string;
  DSN: Maybe<string>;
  version: string;
  signer: {
    rotationInterval: number;
    tokenExpiry: number;
  };
  mail: {
    address: string;
    sender: string;
    host: string;
    port: number;
    username: string;
    password: string;
    pool: boolean;
    retryDelay: number;
  };
  cron: {
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
    CRON_WEEKLY_SUMMARY,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USERNAME,
    SMTP_PASSWORD,
    SMTP_SENDER,
    SMTP_POOL,
    SMTP_ADDRESS,
    SMTP_RETRY_DELAY,
    SENTRY_DSN,
    JWT_ROTATION_INTERVAL,
    JWT_EXPIRY,
  } = envVars;
  return {
    baseUrl: ensureNotEnding("/")(BASE_URL ?? "http://localhost"),
    production: envVars.NODE_ENV === "production",
    cron: {
      weeklySummary: CRON_WEEKLY_SUMMARY ?? "0 16 * * 5",
    },
    DSN: Maybe.fromFalsy(SENTRY_DSN).filter((s) => s !== "<nil>"),
    version: pack.version,
    signer: {
      rotationInterval: +(JWT_ROTATION_INTERVAL ?? 900 * 1000),
      tokenExpiry: +(JWT_EXPIRY ?? 900 * 1000),
    },
    mail: {
      address: SMTP_ADDRESS ?? "ente@ente.app",
      host: SMTP_HOST ?? "localhost",
      port: +(SMTP_PORT ?? 25),
      password: SMTP_PASSWORD ?? "",
      sender: SMTP_SENDER ?? "EntE",
      username: SMTP_USERNAME ?? "root",
      pool: SMTP_POOL === "false" ? false : true,
      retryDelay: +(SMTP_RETRY_DELAY ?? 60 * 60 * 1000),
    },
    db: {
      host: envVars.MYSQL_HOST ?? "localhost",
      port: +(envVars.MYSQL_PORT ?? 3306),
      username: envVars.MYSQL_USERNAME ?? "root",
      password: envVars.MYSQL_PASSWORD ?? "",
      database: envVars.MYSQL_DATABASE ?? "ente",
      timezone: envVars.MYSQL_TIMEZONE ?? "Z",
    },
    redis: {
      host: REDIS_HOST ?? "localhost",
      port: +(REDIS_PORT ?? 6379),
      prefix: REDIS_PREFIX ?? "ENTE_API__",
    },
  };
})();

const getRedisConfig = () => config.redis;

const isDevMode = () => !config.production;

const isProduction = () => config.production;

const getMysqlConfig = () => config.db;

const getBaseUrl = () => config.baseUrl;

const getSentryDsn = () => config.DSN;

const getConfig = () => config;

const getWeeklySummaryCron = () => config.cron.weeklySummary;

const getVersion = () => config.version;

const getMailConfig = () => config.mail;

const getSignerConfig = () => config.signer;

export const Config = {
  getRedisConfig,
  isDevMode,
  isProduction,
  getMailConfig,
  getMysqlConfig,
  getBaseUrl,
  getSentryDsn,
  getConfig,
  getWeeklySummaryCron,
  getVersion,
  getSignerConfig,
};
