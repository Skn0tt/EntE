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
  @PrimaryGeneratedColumn("uuid") _id: EntryId;

  @Column("datetime") date: Date;

  @Column("datetime", { nullable: true })
  dateEnd?: Date;

  @Column("varchar", { length: 300, nullable: true })
  reason?: string;

  @Column("tinyint") forSchool: boolean = false;

  @Column("tinyint", { nullable: false })
  signedManager: boolean = false;

  @Column("tinyint", { nullable: false })
  signedParent: boolean = false;

  /**
   * ## Relations
   */
  @ManyToOne(type => User, user => user._id, { nullable: false })
  student: User;

  @OneToMany(type => Slot, slot => slot._id)
  slots: Slot[] = [];

  /**
   * ## Meta
   */
  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}

export default Entry;
