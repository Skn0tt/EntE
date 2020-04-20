const pack = require("../../package.json");

// this is required for our
// config replacement tool to work
// if we inlined this, Terser
// would mangle the numbers
// and break it.
function toNumber(v: any) {
  return Number(v);
}

type Config = {
  SENTRY_DSN?: string;
  ROTATION_PERIOD: number;
  VERSION: string;
};

const config: Config = {
  SENTRY_DSN: process.env.SENTRY_DSN,
  ROTATION_PERIOD: toNumber(process.env.ROTATION_PERIOD || 300000),
  VERSION: pack.version,
};

export const get = () => config;
