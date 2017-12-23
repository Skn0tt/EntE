import { Schema, model, Document, Model } from 'mongoose';

interface EntryModel extends Document {
  sign(): void;
}

/**
 * # Schema
 */
const entrySchema: Schema = new Schema({
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
entrySchema.methods.sign = function (callback) : void {
  this.signed = true;
  this.save(callback);
};

/**
 * # Model
 */
const entry: Model<EntryModel> = model('entries', entrySchema);


export default entry;
