import { Schema, model } from 'mongoose';

/**
 * # Schema
 */
const entrySchema = new Schema({
  date: { type: Date, required: true, default: Date.now() },
  student: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  slots: { type: [Schema.Types.ObjectId], required: true, ref: 'slots' },
  forSchool: { type: Boolean, required: true },
  signed: { type: Boolean, required: true, default: false },
});

/**
 * # Schema Methods
 */
/**
 * ## Sign an Entry
 */
entrySchema.methods.sign = function (callback) {
  this.signed = true;
  this.save(callback);
};

/**
 * # Model
 */
const entry = model('entries', entrySchema);


export default entry;
