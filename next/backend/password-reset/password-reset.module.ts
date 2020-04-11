import { Module } from "@nestjs/common";
import { PasswordResetController } from "./password-reset.controller";
import { PasswordResetService } from "./password-reset.service";
import { AuthModule } from "../auth/auth.module";
import { EmailModule } from "../email/email.module";
import { DbModule } from "../db/db.module";

@Module({
  imports: [EmailModule, DbModule],
  providers: [PasswordResetService],
  controllers: [PasswordResetController],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
