import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonLoggerService } from "./winston-logger.service";
import * as bodyParser from "body-parser";
import { Config } from "./helpers/config";
import { SentryInterceptor } from "./helpers/sentry-interceptor";
import { getConnectionToken } from "@nestjs/typeorm";
import { Connection } from "typeorm";
import { isDbSchemaPresent } from "./helpers/is-db-schema-present";

const sentryDsn = Config.getSentryDsn();

async function bootstrap() {
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

  async function ensureDBSchemaIsCreated() {
    const schemaIsSynced = await isDbSchemaPresent(dbConnection);
    if (schemaIsSynced) {
      logger.log("DB schema already created. Skipping creation.");
      return;
    }

    logger.log("No DB schema detected. Creating DB schema.");
    await dbConnection.synchronize();
    logger.log("Successfully created DB schema.");
  }

  await ensureDBSchemaIsCreated();

  await dbConnection.runMigrations();

  await app.listen(3000);
}
bootstrap();
