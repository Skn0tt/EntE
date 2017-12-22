import { Schema, model } from 'mongoose';

/**
 * # Schema
 */
const slotSchema = new Schema({
  date: { type: Date, required: true, default: Date.now() },
  hour_from: { type: Number, required: true },
  hour_to: { type: Number, required: true },
  signed: { type: Boolean, default: false, required: true },
  teacher: { type: Schema.Types.ObjectId, required: true },
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
const slot = model('slot', slotSchema);

export default slot;
