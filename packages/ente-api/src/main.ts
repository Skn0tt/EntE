import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonLoggerService } from "./winston-logger.service";
import * as bodyParser from "body-parser";
import { Config } from "./helpers/config";
import { SentryInterceptor } from "./helpers/sentry-interceptor";
import { getConnectionToken } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import * as Sentry from "@sentry/node";

const sentryDsn = Config.getSentryDsn();

async function bootstrap() {
  async function setupSentry(dsn: string) {
    Sentry.init({
      dsn,
      release: Config.getVersion(),
      serverName: Config.getBaseUrl()
    });
  }

  if (sentryDsn.isSome()) {
    setupSentry(sentryDsn.some());
  }

  const logger = new WinstonLoggerService();

  const app = await NestFactory.create(AppModule, {
    logger,
    bodyParser: false
  });

  if (sentryDsn.isSome()) {
    app.useGlobalInterceptors(new SentryInterceptor(sentryDsn.some()));
  }

  app.use(
    bodyParser.json({
      type: "application/json"
    })
  );

  app.use(
    bodyParser.text({
      type: "text/*"
    })
  );

  const dbConnection: Connection = app.get(getConnectionToken() as string);

  await dbConnection.runMigrations();

  await app.listen(3000);
}

bootstrap();
