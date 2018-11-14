import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonLoggerService } from "./winston-logger.service";
import * as bodyParser from "body-parser";
import { DefaultRavenInterceptor } from "./helpers/default-raven-interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerService(),
    bodyParser: false
  });
  app.useGlobalInterceptors(DefaultRavenInterceptor);
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
