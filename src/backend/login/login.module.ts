import { Module } from "@nestjs/common";
import { TokenModule } from "../token/token.module";
import { DbModule } from "../db/db.module";
import { LoginService } from "./login.service";
import { LoginController } from "./login.controller";
import { ReviewedRecordsModule } from "../reviewedRecords/reviewedRecords.module";
import { UsersModule } from "../users/users.module";

@Module({
  controllers: [LoginController],
  providers: [LoginService],
  imports: [TokenModule, DbModule, ReviewedRecordsModule, UsersModule],
})
export class LoginModule {}
