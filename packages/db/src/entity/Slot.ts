import { ISlot, SlotId } from "ente-types";
import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  Column
} from "typeorm";
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
  @PrimaryGeneratedColumn("uuid") _id: SlotId;

  @Column("int") hour_from: number;

  @Column("int") hour_to: number;

  /**
   * ## Relations
   */
  @ManyToOne(type => User, user => user._id, { nullable: false })
  teacher: User;

  @ManyToOne(type => Entry, entry => entry._id)
  entry: Entry;
}

export default Slot;
