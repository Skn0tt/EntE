/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { ISlot, SlotId } from "ente-types";
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Column
} from "typeorm";
import { IsInt } from "class-validator";
import User from "./User";
import Entry from "./Entry";

/**
 * # Slot
 */
@Entity()
class Slot {
  /**
   * ## Attributes
   */
  @PrimaryGeneratedColumn("uuid") readonly _id: SlotId;

  @Column("int", { nullable: false })
  @IsInt()
  readonly hour_from: number;

  @Column("int", { nullable: false })
  @IsInt()
  readonly hour_to: number;

  /**
   * ## Relations
   */
  @ManyToOne(type => User, user => user.slots, { nullable: false })
  teacher: User;

  @ManyToOne(type => Entry, entry => entry.slots)
  entry: Entry;
}

export default Slot;
