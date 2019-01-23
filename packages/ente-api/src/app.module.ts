import { Module, NestModule, MiddlewareConsumer, Global } from "@nestjs/common";
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
import { migrations } from "./db/migrations";
import { CustomTypeOrmLogger } from "./custom-typeorm-logger";
import { DevModule } from "./dev/dev.module";
import { InstanceModule } from "./instance/instance.module";
import { InstanceConfigModule } from "./instance-config/instance-config.module";

const {
  database,
  host,
  password,
  port,
  username,
  timezone
} = Config.getMysqlConfig();

const isDevMode = Config.isDevMode();

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      username,
      migrations,
      port,
      password,
      host,
      database,
      timezone,
      entities: [User, Slot, Entry],
      synchronize: false,
      logger: new CustomTypeOrmLogger(),
      logging: "all"
    }),
    InstanceConfigModule,
    SlotsModule,
    EntriesModule,
    PasswordResetModule,
    UsersModule,
    TokenModule,
    StatusModule,
    InstanceModule,
    ExportModule,
    ...(isDevMode ? [DevModule] : [])
  ],
  providers: [WinstonLoggerService, ScheduleService],
  exports: [WinstonLoggerService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
