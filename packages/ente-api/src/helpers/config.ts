import { Some, None, Maybe } from "monet";
import { ensureNotEnding } from "./ensure-not-ending";
const pack = require("../../package.json");

interface IConfig {
  production: boolean;
  baseUrl: string;
  DSN: Maybe<string>;
  signerBaseUrl: string;
  version: string;
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
  };
  redis: {
    host: string;
    port: number;
    prefix: string;
  };
}

const config = (): IConfig => {
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
    SMTP_ADDRESS
  } = envVars;
  return {
    baseUrl: ensureNotEnding("/")(BASE_URL),
    production: envVars.NODE_ENV === "production",
    cron: {
      enable: ENABLE_CRON_JOBS === "true",
      weeklySummary: CRON_WEEKLY_SUMMARY
    },
    DSN:
      envVars.SENTRY_DSN !== "undefined"
        ? Some(envVars.SENTRY_DSN)
        : None<string>(),
    version: pack.version,
    signerBaseUrl: envVars.SIGNER_BASEURL,
    mail: {
      address: SMTP_ADDRESS,
      host: SMTP_HOST,
      port: +SMTP_PORT,
      password: SMTP_PASSWORD,
      sender: SMTP_SENDER,
      username: SMTP_USERNAME,
      pool: SMTP_POOL === "FALSE" ? false : true
    },
    db: {
      host: envVars.MYSQL_HOST,
      port: +envVars.MYSQL_PORT,
      username: envVars.MYSQL_USERNAME,
      password: envVars.MYSQL_PASSWORD,
      database: envVars.MYSQL_DATABASE
    },
    redis: {
      host: REDIS_HOST,
      port: +REDIS_PORT,
      prefix: REDIS_PREFIX || "ENTE_API_"
    }
  };
};

export class Config {
  static getRedisConfig() {
    return this.getConfig().redis;
  }

  static getMysqlConfig() {
    return this.getConfig().db;
  }

  static getBaseUrl() {
    return this.getConfig().baseUrl;
  }

  static getSentryDsn() {
    return this.getConfig().DSN;
  }

  static getConfig() {
    return config();
  }

  static isCronEnabled() {
    return this.getConfig().cron.enable;
  }

  static getWeeklySummaryCron() {
    return this.getConfig().cron.weeklySummary;
  }

  static getSignerBaseUrl() {
    return this.getConfig().signerBaseUrl;
  }

  static getVersion() {
    return this.getConfig().version;
  }

  static getMailConfig() {
    return this.getConfig().mail;
  }
}
