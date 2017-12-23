import { Schema, model } from 'mongoose';

export interface ISlot {
  date: Date;
  hour_from: Number;
  hour_to: Number;
  signed: boolean;
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
  teacher: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
});

/**
 * # Schema Methods
 */
/**
 * ## Sign a Slot
 */
slotSchema.methods.sign = function (callback) {
  this.signed = true;
  this.save(callback);
};

/**
 * # Model
 */
const slot = model('slots', slotSchema);

export default slot;
