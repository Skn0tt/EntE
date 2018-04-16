import { IEntry, UserId, SlotId } from "ente-types";
import {
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToMany
} from "typeorm";
import { IsBoolean } from "class-validator";
import User from "./User";
import Slot from "./Slot";

type EntryId = string;

/**
 * # Entry
 */
@Entity()
class Entry {
  /**
   * ## Attributes
   */
  @PrimaryGeneratedColumn("uuid") readonly _id: EntryId;

  @Column("datetime") readonly date: Date;

  @Column("datetime", { nullable: true })
  readonly dateEnd?: Date;

  @Column("varchar", { length: 300, nullable: true })
  readonly reason?: string;

  @Column("tinyint")
  @IsBoolean()
  forSchool: boolean = false;

  @Column("tinyint", { nullable: false })
  @IsBoolean()
  signedManager: boolean = false;

  @Column("tinyint", { nullable: false })
  @IsBoolean()
  signedParent: boolean = false;

  /**
   * ## Relations
   */
  @ManyToOne(type => User, user => user._id, { nullable: false })
  readonly student: User;

  @OneToMany(type => Slot, slot => slot._id)
  readonly slots: Slot[] = [];

  /**
   * ## Meta
   */
  @CreateDateColumn() readonly createdAt: Date;

  @UpdateDateColumn() readonly updatedAt: Date;
}

export default Entry;
