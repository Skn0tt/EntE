import { Schema, model, Document, Model } from 'mongoose';
import { MongoId } from '../constants';
import * as validate from 'mongoose-validator';
import * as idValidator from 'mongoose-id-validator';

export interface SlotModel extends Document, ISlot {
  sign(): void;
}

export interface ISlot {
  date: Date;
  hour_from: Number;
  hour_to: Number;
  signed: boolean;
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
  signed: { type: Boolean, required: true, default: false },
  student: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  teacher: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
}, {
  versionKey: false,
});
slotSchema.plugin(idValidator);

/**
 * # Schema Methods
 */
slotSchema.methods.sign = function (callback) : void {
  this.signed = true;
  this.save(callback);
};

/**
 * # Model
 */
const slot : Model<SlotModel> = model('slots', slotSchema);

export default slot;
