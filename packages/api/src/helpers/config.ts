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
    host: process.env.HOST,
    production: process.env.NODE_ENV === "production",
    DSN: process.env.SENTRY_DSN,
    smtp: {
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD
    }
  };

  config = env;
};

export const getConfig = () => {
  if (!config) {
    createFromEnv();
  }
  return config;
};

export default { getConfig };
