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
import { User } from "./user.entity";
import { Slot } from "./slot.entity";
import { EntryReason } from "./entry-reason.entity";

/**
 * # Entry
 */
@Entity()
export class Entry {
  /**
   * ## Attributes
   */
  @PrimaryGeneratedColumn("uuid") readonly _id: string;

  @Column("date") readonly date: string;

  @Column("date", { nullable: true })
  readonly dateEnd: string | null;

  @Column(type => EntryReason)
  reason: EntryReason | null;

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
