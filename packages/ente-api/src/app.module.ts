import { Module, NestModule, MiddlewareConsumer, Global } from "@nestjs/common";
import { RavenModule } from "nest-raven";
import { SlotsModule } from "./slots/slots.module";
import { EntriesModule } from "./entries/entries.module";
import { TokenModule } from "./token/token.module";
import { StatusModule } from "./status/status.module";
import { WinstonLoggerService } from "./winston-logger.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Config } from "./helpers/config";
import { User } from "./db/user.entity";
import { Slot } from "./db/slot.entity";
import { Entry } from "./db/entry.entity";
import { LoggerMiddleware } from "./logger.middleware";
import { UsersModule } from "./users/users.module";
import { PasswordResetModule } from "./password-reset/password-reset.module";
import { ScheduleService } from "./schedule.service";
import { ExportModule } from "./export/export.module";
import { Request } from "express";
import { UserDto } from "ente-types";

const { database, host, password, port, username } = Config.getMysqlConfig();
const sentryDsn = Config.getSentryDsn();
const baseUrl = Config.getBaseUrl();
const version = Config.getVersion();

const ravenImport = sentryDsn
  .map(dsn => [
    RavenModule.forRoot(dsn, {
      name: baseUrl,
      release: version,
      tags: { instance: baseUrl },
      parseUser: (req: Request) => {
        const user: UserDto = req.user;
        return {
          username: user.username,
          id: user.id
        };
      }
    })
  ])
  .orSome([]);

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      username,
      port,
      password,
      host,
      database,
      entities: [User, Slot, Entry],
      synchronize: true
    }),
    ...ravenImport,
    SlotsModule,
    EntriesModule,
    PasswordResetModule,
    UsersModule,
    TokenModule,
    StatusModule,
    ExportModule
  ],
  providers: [WinstonLoggerService, ScheduleService],
  exports: [WinstonLoggerService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
