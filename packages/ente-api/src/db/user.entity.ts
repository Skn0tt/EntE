/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import {
  rolesArr,
  Roles,
  isValidUsername,
  isValidDisplayname,
  isValidEmail,
  CustomStringValidator,
  Languages,
  languagesArr
} from "ente-types";
import {
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  OneToMany
} from "typeorm";
import { IsIn, IsInt, IsISO8601 } from "class-validator";
import Entry from "./entry.entity";
import Slot from "./slot.entity";

/**
 * # User
 */
@Entity()
export class User {
  /**
   * ## Attributes
   */
  @PrimaryGeneratedColumn("uuid") readonly _id: string;

  @Column("varchar", { length: 80, unique: true })
  @CustomStringValidator(isValidUsername)
  readonly username: string;

  @Column("varchar", { length: 80 })
  @CustomStringValidator(isValidDisplayname)
  displayname: string;

  @Column("varchar", { length: 80 })
  @CustomStringValidator(isValidEmail)
  email: string;

  @Column("date", { nullable: true })
  @IsISO8601()
  birthday: string;

  @Column("varchar", { nullable: false })
  @IsIn(languagesArr)
  language: Languages;

  @Column("varchar", { length: 80 })
  @IsIn(rolesArr)
  role: Roles;

  @Column("smallint", { nullable: true })
  @IsInt()
  graduationYear?: number;

  /**
   * ## Password
   */
  @Column("varchar", { nullable: true })
  password: string | null;

  /**
   * ## Relations
   */
  @ManyToMany(type => User, user => user.parents)
  @JoinTable()
  children: User[];

  @ManyToMany(type => User, user => user.children)
  parents: User[];

  @OneToMany(type => Entry, entry => entry.student)
  entries: Entry[];

  @OneToMany(type => Slot, slot => slot.teacher)
  slots: Slot[];
}

export default User;
