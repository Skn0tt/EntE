import * as winston from "winston";

const { combine, timestamp, json, metadata } = winston.format;

const logger = winston.createLogger({
  transports: [new winston.transports.Console({ level: "debug" })],
  format: combine(timestamp(), metadata(), json())
});

type LogFunc = (msg: string, ...meta: any[]) => void;

export const error: LogFunc = (msg, ...meta) => {
  logger.error(msg, ...meta);
};

export const warn: LogFunc = (msg, ...meta) => {
  logger.warn(msg, ...meta);
};

export const info: LogFunc = (msg, ...meta) => {
  logger.info(msg, ...meta);
};

export const verbose: LogFunc = (msg, ...meta) => {
  logger.verbose(msg, ...meta);
};

export const debug: LogFunc = (msg, ...meta) => {
  logger.debug(msg, ...meta);
};

export const silly: LogFunc = (msg, ...meta) => {
  logger.silly(msg, ...meta);
};

export default {
  error,
  warn,
  info,
  verbose,
  debug,
  silly
};
