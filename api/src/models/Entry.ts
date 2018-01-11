import { Schema, model, Document, Model } from 'mongoose';
import { MongoId } from '../constants';
import * as idValidator from 'mongoose-id-validator';

export interface EntryModel extends Document, IEntry {
  signParent(): void;
  signAdmin(): void;
}

export interface IEntry {
  date: Date;
  dateEnd: Date;
  student: MongoId;
  slots: MongoId[];
  forSchool: boolean;
  signedAdmin: boolean;
  signedParent: boolean;
}

/**
 * # Schema
 */
const entrySchema: Schema = new Schema({
  date: { type: Date, required: true, default: Date.now() },
  dateEnd: { type: Date, required: false, default: Date.now() },
  student: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  slots: [{ type: Schema.Types.ObjectId, ref: 'slots' }],
  forSchool: { type: Boolean, required: true },
  reason: { type: String, maxlength: 300 },
  signedParent: { type: Boolean, required: true, default: false },
  signedAdmin: { type: Boolean, required: true, default: false },
}, {
  versionKey: false,
});
entrySchema.plugin(idValidator);

/**
 * # Schema Methods
 */
/**
 * ## Sign an Entry
 */
entrySchema.methods.signParent = function (callback) : void {
  this.signedParent = true;
  this.save(callback);
};
entrySchema.methods.signAdmin = function (callback) : void {
  this.signedAdmin = true;
  this.save(callback);
};

/**
 * # Model
 */
const entry: Model<EntryModel> = model('entries', entrySchema);


export default entry;
