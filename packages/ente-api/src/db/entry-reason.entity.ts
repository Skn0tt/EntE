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
  category: EntryReasonCategory | null;

  @Column("smallint", { nullable: true })
  from: number | null;

  @Column("smallint", { nullable: true })
  to: number | null;

  @Column("varchar", { nullable: true })
  description: string | null;

  @ManyToOne(type => User, {
    nullable: true,
    onDelete: "SET NULL"
  })
  teacher: User | null;
}
