const { configure } = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
require("reflect-metadata");

process.env = {
  BASE_URL: "localhost",
  REDIS_HOST: "redishost",
  REDIS_PORT: 1234,
  REDIS_PREFIX: "ENTE_",
  ENABLE_CRON_JOBS: "true",
  CRON_WEEKLY_SUMMARY: "* * * * *",
  SMTP_HOST: "smtphost",
  SMTP_PORT: 587,
  SMTP_USERNAME: "smtpusername",
  SMTP_PASSWORD: "smtppassword",
  SMTP_SENDER: "test@test.com",
  SMTP_POOL: "true",
  SMTP_ADDRESS: "",
  DEFAULT_LANGUAGE: "en"
};

configure({ adapter: new Adapter() });
