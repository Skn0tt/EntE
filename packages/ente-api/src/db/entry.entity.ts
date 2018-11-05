/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

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
import User from "./user.entity";
import Slot from "./slot.entity";

/**
 * # Entry
 */
@Entity()
export class Entry {
  /**
   * ## Attributes
   */
  @PrimaryGeneratedColumn("uuid") readonly _id: string;

  @Column("datetime") readonly date: Date;

  @Column("datetime", { nullable: true })
  readonly dateEnd?: Date | null;

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
  @ManyToOne(type => User, user => user.entries, {
    nullable: false,
    eager: true,
    onDelete: "CASCADE"
  })
  readonly student: User;

  @OneToMany(type => Slot, slot => slot.entry, {
    eager: true
  })
  readonly slots: Slot[];

  /**
   * ## Meta
   */
  @CreateDateColumn() readonly createdAt: Date;

  @UpdateDateColumn() readonly updatedAt: Date;
}

export default Entry;
