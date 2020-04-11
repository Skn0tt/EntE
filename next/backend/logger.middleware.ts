import { Injectable, NestMiddleware, Inject } from "@nestjs/common";
import { WinstonLoggerService } from "./winston-logger.service";
import morgan from "morgan";
import { RequestHandler, Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  morgan: RequestHandler;

  constructor(
    @Inject(WinstonLoggerService)
    private readonly winstonLogger: WinstonLoggerService
  ) {
    this.morgan = morgan("combined", {
      stream: {
        write: (s) => {
          this.winstonLogger.log(s);
        },
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.morgan(req, res, next);
  }
}
