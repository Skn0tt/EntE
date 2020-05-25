import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { PasswordResetModule } from "../password-reset/password-reset.module";
import { DbModule } from "../db/db.module";
import { InstanceConfigModule } from "../instance-config/instance-config.module";
import { UIStateService } from "./ui-state.service";

@Module({
  imports: [DbModule, AuthModule, PasswordResetModule, InstanceConfigModule],
  providers: [UsersService, UIStateService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
