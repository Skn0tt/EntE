import { LoggerService } from "@nestjs/common";
import * as winston from "winston";

const { combine, timestamp, json, metadata } = winston.format;

const logger = winston.createLogger({
  transports: [new winston.transports.Console({ level: "debug" })],
  format: combine(timestamp(), metadata(), json()),
});

export class WinstonLoggerService implements LoggerService {
  static log(message: any, context?: string | undefined) {
    logger.info(message, context);
  }

  static error(message: any, trace?: any, context?: string | undefined) {
    logger.error(message, trace, context);
  }

  static warn(message: any, context?: string | undefined) {
    logger.warn(message, context);
  }

  log = WinstonLoggerService.log;
  warn = WinstonLoggerService.warn;
  error = WinstonLoggerService.error;
}
