/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

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
import { CustomValidate } from "../helpers/customValidate";
import {
  isValidUsername,
  isValidDisplayname,
  isValidEmail
} from "ente-validator";
import {
  IsEmail,
  IsBoolean,
  IsIn,
  IsOptional,
  IsHexadecimal
} from "class-validator";

/**
 * # User
 */
@Entity()
class User {
  /**
   * ## Attributes
   */
  @PrimaryGeneratedColumn("uuid") readonly _id: UserId;

  @Column("varchar", { length: 80, unique: true })
  @CustomValidate(isValidUsername)
  readonly username: string;

  @Column("varchar", { length: 80 })
  @CustomValidate(isValidDisplayname)
  displayname: string;

  @Column("varchar", { length: 80 })
  @CustomValidate(isValidEmail)
  email: string;

  @Column("tinyint", { default: false })
  @IsBoolean()
  isAdult: boolean = false;

  @Column("varchar", { length: 80 })
  @IsIn(rolesArr)
  role: Roles;

  /**
   * ## Password
   */
  @Column("varchar", { nullable: true })
  password: string | null;

  @Column("varchar", { nullable: true })
  @IsOptional()
  @IsHexadecimal()
  passwordResetToken?: string | null;

  @Column("datetime", { nullable: true })
  passwordResetExpiry?: Date | null;

  /**
   * ## Relations
   */
  @ManyToMany(type => User, user => user.parents)
  @JoinTable()
  children: User[] = [];

  @ManyToMany(type => User, user => user.children)
  parents: User[] = [];

  @OneToMany(type => Entry, entry => entry.student)
  entries: Entry[] = [];

  @OneToMany(type => Slot, slot => slot.teacher)
  slots: Slot[] = [];
}

export default User;
