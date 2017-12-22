import { Schema, model } from 'mongoose';

/**
 * # Schema
 */
const EntrySchema = new Schema({
  date: { type: Date, required: true },
  student: { type: Schema.Types.ObjectId, required: true },
  slots: { type: [ Schema.Types.ObjectId ], required: true },
  forSchool: { type: Boolean, required: true }
});

/**
 * # Model
 */
const Entry = model('entries', EntrySchema);

export default Entry;
