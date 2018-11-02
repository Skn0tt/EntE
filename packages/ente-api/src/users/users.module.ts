import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "../auth/auth.module";
import { PasswordResetModule } from "../password-reset/password-reset.module";
import { DbModule } from "../db/db.module";

@Module({
  imports: [DbModule, AuthModule, PasswordResetModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
