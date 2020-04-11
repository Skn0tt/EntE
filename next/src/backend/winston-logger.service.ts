import { LoggerService } from "@nestjs/common";
import * as winston from "winston";

const { combine, timestamp, json, metadata } = winston.format;

export class WinstonLoggerService implements LoggerService {
  static readonly logger = winston.createLogger({
    transports: [new winston.transports.Console({ level: "debug" })],
    format: combine(timestamp(), metadata(), json()),
  });

  static log = WinstonLoggerService.logger.info;
  static error = WinstonLoggerService.logger.error;
  static warn = WinstonLoggerService.logger.warn;

  log = WinstonLoggerService.log;
  error = WinstonLoggerService.error;
  warn = WinstonLoggerService.warn;
}
