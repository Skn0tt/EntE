import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WinstonLoggerService } from "./winston-logger.service";
import { ValidationPipe } from "@nestjs/common";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLoggerService(),
    bodyParser: false
  });
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
