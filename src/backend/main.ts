import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonLoggerService } from "./winston-logger.service";
import { Config } from "./helpers/config";
import { SentryInterceptor } from "./helpers/sentry-interceptor";
import * as Sentry from "@sentry/node";
import { DontSendUndefinedInterceptor } from "./dont-send-undefined.interceptor";

const sentryDsn = Config.getSentryDsn();

export async function bootstrap() {
  const logger = new WinstonLoggerService();

  const app = await NestFactory.create(AppModule, {
    logger,
    bodyParser: false,
  });

  // is required for Next.JS's way of handling
  // `res.send(undefined)`
  app.useGlobalInterceptors(new DontSendUndefinedInterceptor());

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
  await app.init();

  return app;
}
