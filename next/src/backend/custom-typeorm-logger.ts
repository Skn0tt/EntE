import { Logger, QueryRunner } from "typeorm";
import { WinstonLoggerService } from "./winston-logger.service";

export class CustomTypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    throw new Error("Method not implemented.");
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    WinstonLoggerService.error(error, { query, parameters });
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ) {
    // ignore
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    // ignore
    WinstonLoggerService.log(message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    WinstonLoggerService.log(message);
  }

  log(level: "log" | "info" | "warn", message: any, queryRunner?: QueryRunner) {
    WinstonLoggerService.log(level, message);
  }
}
