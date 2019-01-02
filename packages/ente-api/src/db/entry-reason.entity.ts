import {
  EntryReasonCategory,
  entryReasonCategoryArray
} from "ente-types/src/dtos/entry-reason.dto";
import { Entity, Column, ManyToOne } from "typeorm";
import { IsIn } from "class-validator";
import { User } from "./user.entity";

@Entity()
export class EntryReason {
  @Column("varchar", { nullable: true })
  @IsIn(entryReasonCategoryArray)
  category: EntryReasonCategory;

  @Column("smallint", { nullable: true })
  from?: number;

  @Column("smallint", { nullable: true })
  to?: number;

  @Column("varchar", { nullable: true })
  description?: string;

  @ManyToOne(type => User, {
    nullable: true,
    onDelete: "SET NULL"
  })
  teacher?: User;
}
