import { Schema, model, Document, Model } from 'mongoose';
import { MongoId } from '../constants';
import * as validate from 'mongoose-validator';
import * as idValidator from 'mongoose-id-validator';

export interface SlotModel extends Document, ISlot {}

export interface ISlot {
  date: Date;
  hour_from: Number;
  hour_to: Number;
  student: MongoId;
  teacher: MongoId;
}

/**
 * # Schema
 */
const slotSchema = new Schema({
  date: { type: Date, required: true, default: Date.now() },
  hour_from: { type: Number, required: true, min: 1, max: 12 },
  hour_to: { type: Number, required: true, min: 1, max: 12 },
  student: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  teacher: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
}, {
  versionKey: false,
});
slotSchema.plugin(idValidator);

/**
 * # Model
 */
const slot : Model<SlotModel> = model('slots', slotSchema);

export default slot;
