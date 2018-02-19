import { Schema, model, Document, Model } from 'mongoose';
import { MongoId } from '../constants';
import * as idValidator from 'mongoose-id-validator';
import * as timestamps from 'mongoose-timestamp';

export interface EntryModel extends Document, IEntry {
  signParent(): void;
  signManager(): void;
}

export interface IEntryBase {
  date: Date;
  dateEnd: Date;
  student: MongoId;
  slots: MongoId[];
  forSchool: boolean;
  reason: string;
  signedManager: boolean;
  signedParent: boolean;
}

interface IEntryTimestamps {
  createdAt: Date;
  updatedAt: Date;
}
type IEntryPlugins = IEntryTimestamps;

export type IEntry = IEntryBase & IEntryPlugins;

/**
 * # Schema
 */
const entrySchema: Schema = new Schema(
  {
    date: { type: Date, required: true, default: Date.now() },
    dateEnd: { type: Date, required: false, default: Date.now() },
    student: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    slots: [{ type: Schema.Types.ObjectId, ref: 'slots' }],
    forSchool: { type: Boolean, required: true },
    reason: { type: String, maxlength: 300 },
    signedManager: { type: Boolean, required: true, default: false },
    signedParent: { type: Boolean, required: true, default: false },
  },
  {
    versionKey: false,
  },
);
entrySchema.plugin(idValidator);
entrySchema.plugin(timestamps);

/**
 * # Schema Methods
 */
/**
 * ## Sign an Entry
 */
entrySchema.methods.signParent = function(callback): void {
  this.signedParent = true;
  this.save(callback);
};
entrySchema.methods.signManager = function(callback): void {
  this.signedManager = true;
  this.save(callback);
};

/**
 * # Model
 */
const entry: Model<EntryModel> = model('entries', entrySchema);

export default entry;
