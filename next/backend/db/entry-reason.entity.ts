import { EntryReasonCategory, entryReasonCategoryArray } from "ente-types";
import { Entity, Column, ManyToOne } from "typeorm";
import { IsIn } from "class-validator";
import { User } from "./user.entity";

@Entity()
export class EntryReason {
  @Column("enum", { nullable: true, enum: EntryReasonCategory })
  @IsIn(entryReasonCategoryArray)
  category: EntryReasonCategory;

  @Column("smallint", { nullable: true })
  from: number | null;

  @Column("smallint", { nullable: true })
  to: number | null;

  @Column("varchar", { nullable: true })
  description: string | null;

  @ManyToOne((type) => User, {
    nullable: true,
    onDelete: "SET NULL",
  })
  teacher: User | null;
}
