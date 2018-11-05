/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { IsInt } from "class-validator";
import Entry from "./entry.entity";
import User from "./user.entity";

/**
 * # Slot
 */
@Entity()
export class Slot {
  /**
   * ## Attributes
   */
  @PrimaryGeneratedColumn("uuid") readonly _id: string;

  @Column("date", { nullable: false })
  readonly date: Date;

  @Column("int", { nullable: false })
  @IsInt()
  readonly hour_from: number;

  @Column("int", { nullable: false })
  @IsInt()
  readonly hour_to: number;

  /**
   * ## Relations
   */
  @ManyToOne(type => User, user => user.slots, {
    nullable: true,
    onDelete: "SET NULL"
  })
  teacher: User | null;

  @ManyToOne(type => Entry, entry => entry.slots, {
    nullable: false,
    onDelete: "CASCADE"
  })
  entry: Entry;
}

export default Slot;
