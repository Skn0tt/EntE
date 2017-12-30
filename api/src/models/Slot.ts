import { Schema, model, Document, Model } from 'mongoose';

export interface SlotModel extends Document, ISlot {}

export interface ISlot {
  date: Date;
  hour_from: Number;
  hour_to: Number;
  signed: boolean;
  student: Schema.Types.ObjectId;
  teacher: Schema.Types.ObjectId;
}

/**
 * # Schema
 */
const slotSchema = new Schema({
  date: { type: Date, required: true, default: Date.now() },
  hour_from: { type: Number, required: true },
  hour_to: { type: Number, required: true },
  signed: { type: Boolean, default: false, required: true },
  student: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  teacher: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
});

/**
 * # Model
 */
const slot : Model<SlotModel> = model('slots', slotSchema);

export default slot;
