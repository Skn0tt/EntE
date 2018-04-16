import { rolesArr, Roles, UserId } from "ente-types";
import {
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  OneToMany
} from "typeorm";
import Entry from "./Entry";
import Slot from "./Slot";

/**
 * # User
 */
@Entity()
class User {
  /**
   * ## Attributes
   */
  @PrimaryGeneratedColumn("uuid") _id: UserId;

  @Column("varchar", { length: 80 })
  username: string;

  @Column("varchar", { length: 80 })
  displayname: string;

  @Column("varchar", { length: 80 })
  email: string;

  @Column("tinyint", { default: false })
  isAdult: boolean = false;

  @Column("varchar", { length: 80 })
  role: Roles;

  /**
   * ## Password
   */
  @Column("varchar", { nullable: true })
  password: string;

  @Column("varchar", { nullable: true })
  passwordResetToken?: string;

  @Column("datetime", { nullable: true })
  passwordResetExpiry?: Date;

  /**
   * ## Relations
   */
  @ManyToMany(type => User, user => user._id)
  @JoinTable()
  children: User[] = [];

  @OneToMany(type => Entry, entry => entry.student)
  entries: Entry[] = [];

  @OneToMany(type => Slot, slot => slot.teacher)
  slots: Slot[] = [];
}

export default User;
