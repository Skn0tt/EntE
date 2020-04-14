const pack = require("../../package.json");

const SECOND = 1000;
const MINUTE = 60 * SECOND;

type Config = {
  SENTRY_DSN?: string;
  ROTATION_PERIOD: number;
  VERSION: string;
};

function getRotationPeriod() {
  if (process.env.ROTATION_PERIOD) {
    return +process.env.ROTATION_PERIOD * 1000;
  }

  return 5 * MINUTE;
}

const config: Config = {
  SENTRY_DSN: process.env.SENTRY_DSN,
  ROTATION_PERIOD: getRotationPeriod(),
  VERSION: pack.version,
};

export const get = () => config;
