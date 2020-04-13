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
import { RecordReviewal } from "./db/recordReviewal.entity";
import { LoggerMiddleware } from "./logger.middleware";
import { UsersModule } from "./users/users.module";
import { PasswordResetModule } from "./password-reset/password-reset.module";
import { ExportModule } from "./export/export.module";
import { migrations } from "./db/migrations";
import { CustomTypeOrmLogger } from "./custom-typeorm-logger";
import { DevModule } from "./dev/dev.module";
import { InstanceModule } from "./instance/instance.module";
import { InstanceConfigModule } from "./instance-config/instance-config.module";
import { LoginModule } from "./login/login.module";
import { KeyValueStore } from "./db/keyvaluestore.entity";
import { WeeklyUpdatesSchedulerModule } from "./weekly-updates-scheduler/weekly-updates-scheduler.module";
import { ReviewedRecordsModule } from "./reviewedRecords/reviewedRecords.module";

const {
  database,
  host,
  password,
  port,
  username,
  timezone,
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
      dateStrings: ["DATE"],
      entities: [User, Slot, Entry, KeyValueStore, RecordReviewal],
      synchronize: false,
      logger: new CustomTypeOrmLogger(),
      logging: "all",
      keepConnectionAlive: true,
    }),
    InstanceConfigModule,
    SlotsModule,
    EntriesModule,
    PasswordResetModule,
    UsersModule,
    TokenModule,
    StatusModule,
    InstanceModule,
    WeeklyUpdatesSchedulerModule,
    LoginModule,
    ExportModule,
    ReviewedRecordsModule,
    ...(isDevMode ? [DevModule] : []),
  ],
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
