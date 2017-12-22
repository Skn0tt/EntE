import { Schema, model } from 'mongoose';

/**
 * # Schema
 */
const entrySchema = new Schema({
  date: { type: Date, required: true },
  student: { type: Schema.Types.ObjectId, required: true },
  slots: { type: [Schema.Types.ObjectId], required: true },
  forSchool: { type: Boolean, required: true },
});

/**
 * # Model
 */
const entry = model('entries', entrySchema);

export default entry;
