module.exports = {
  experimental: {
    jsconfigPaths: true,
  },
  environment: {
    SENTRY_DSN: process.env.SENTRY_DSN,
    ROTATION_PERIOD: process.env.ROTATION_PERIOD,
  },
};
