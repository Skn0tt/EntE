import {
  Injectable,
  NestMiddleware,
  MiddlewareFunction,
  Inject
} from "@nestjs/common";
import { WinstonLoggerService } from "./winston-logger.service";
import * as morgan from "morgan";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly winstonLogger: WinstonLoggerService
  ) {}

  resolve(): MiddlewareFunction {
    return morgan("combined", {
      stream: {
        write: s => {
          this.winstonLogger.log(s);
        }
      }
    });
  }
}
