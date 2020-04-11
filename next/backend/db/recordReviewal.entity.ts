import { CustomStringValidator, isValidUuid } from "ente-types";
import { Entity, PrimaryColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { IsString } from "class-validator";

@Entity("record_reviewal")
export class RecordReviewal {
  @ManyToOne((type) => User, (user) => user.parents, {
    nullable: false,
    onDelete: "CASCADE",
    primary: true,
  })
  user: User;

  @IsString()
  @CustomStringValidator(isValidUuid)
  @PrimaryColumn("char", { length: 36, nullable: false })
  recordId: string;
}
