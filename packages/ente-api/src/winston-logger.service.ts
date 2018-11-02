import { LoggerService } from "@nestjs/common";
import * as winston from "winston";

const { combine, timestamp, json, metadata } = winston.format;

export class WinstonLoggerService implements LoggerService {
  private readonly logger = winston.createLogger({
    transports: [new winston.transports.Console({ level: "debug" })],
    format: combine(timestamp(), metadata(), json())
  });

  log = this.logger.info;
  error = this.logger.error;
  warn = this.logger.warn;
}
