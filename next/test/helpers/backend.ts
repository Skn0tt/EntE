export function setupEnvVars() {
  process.env = {
    NODE_ENV: "development",
    BASE_URL: "localhost",
    RAILMAIL_HOST: "http://railmail",
    SIGNER_BASEURL: "http://signer:3000",
    MYSQL_HOST: "localhost",
    MYSQL_PORT: "3306",
    MYSQL_DATABASE: "ente",
    MYSQL_USERNAME: "ente",
    MYSQL_PASSWORD: "root",
    REDIS_HOST: "redis",
    REDIS_PORT: "6379",
  };
}
