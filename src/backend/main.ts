import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonLoggerService } from "./winston-logger.service";
import { Config } from "./helpers/config";
import { SentryInterceptor } from "./helpers/sentry-interceptor";
import { getConnectionToken } from "@nestjs/typeorm";
import type { Connection } from "typeorm";
import * as Sentry from "@sentry/node";

const sentryDsn = Config.getSentryDsn();

export async function bootstrap() {
  const logger = new WinstonLoggerService();

  const app = await NestFactory.create(AppModule, {
    logger,
    bodyParser: false,
  });

  sentryDsn.forEach((dsn) => {
    console.log(dsn);
    Sentry.init({
      dsn,
      release: Config.getVersion(),
      serverName: Config.getBaseUrl(),
    });

    app.useGlobalInterceptors(new SentryInterceptor(dsn));
  });

  app.setGlobalPrefix("api");

  const dbConnection: Connection = app.get(getConnectionToken() as string);

  await dbConnection.runMigrations();
  await app.init();

  return app;
}
