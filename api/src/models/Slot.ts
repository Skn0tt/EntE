import { Schema, model } from 'mongoose';

/**
 * # Schema
 */
const SlotSchema = new Schema({
  date: { type: Date, required: true, default: Date.now() },
  hour_from: { type: Number, required: true },
  hour_to: { type: Number, required: true },
  signed: { type: Boolean, default: false, required: true },
  teacher: { type: Schema.Types.ObjectId, required: true }
});

/**
 * # Schema Methods
 */
/**
 * ## Sign a Slot
 */
SlotSchema.methods.sign = function(callback) {
  this.signed = true;
  this.save(callback);
};

/**
 * # Model
 */
const Slot = model('slot', SlotSchema);

export default Slot;