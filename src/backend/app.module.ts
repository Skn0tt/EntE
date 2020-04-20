import { Module, NestModule, MiddlewareConsumer, Global } from "@nestjs/common";
import { SlotsModule } from "./slots/slots.module";
import { EntriesModule } from "./entries/entries.module";
import { TokenModule } from "./token/token.module";
import { StatusModule } from "./status/status.module";
import { WinstonLoggerService } from "./winston-logger.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Config } from "./helpers/config";
import { LoggerMiddleware } from "./logger.middleware";
import { UsersModule } from "./users/users.module";
import { PasswordResetModule } from "./password-reset/password-reset.module";
import { ExportModule } from "./export/export.module";
import { DevModule } from "./dev/dev.module";
import { InstanceModule } from "./instance/instance.module";
import { InstanceConfigModule } from "./instance-config/instance-config.module";
import { LoginModule } from "./login/login.module";
import { ReviewedRecordsModule } from "./reviewedRecords/reviewedRecords.module";
import { TypeOrmOptionsFactory } from "./typeorm-options.factory";
import { ScheduleModule } from "@nestjs/schedule";

const isDevMode = Config.isDevMode();

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmOptionsFactory,
    }),
    ScheduleModule.forRoot(),
    InstanceConfigModule,
    SlotsModule,
    EntriesModule,
    PasswordResetModule,
    UsersModule,
    TokenModule,
    StatusModule,
    InstanceModule,
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
