import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonLoggerService } from "./winston-logger.service";
import * as bodyParser from "body-parser";
import { Config } from "./helpers/config";
import { SentryInterceptor } from "./helpers/sentry-interceptor";

const sentryDsn = Config.getSentryDsn();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerService(),
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
  await app.listen(3000);
}
bootstrap();
