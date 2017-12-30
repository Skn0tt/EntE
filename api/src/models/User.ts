import { Schema, model, Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { roles, ROLES, MongoId } from '../constants';

export interface UserModel extends Document, IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUser {
  username: string;
  displayname: string;
  email: string;
  password: string;
  role: ROLES;
  children: MongoId[];
}

/**
 * # Schema
 */
const userSchema : Schema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  displayname: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, enum: roles, required: true },
  children: [{ type: Schema.Types.ObjectId, ref: 'users' }],
}, {
  versionKey: false,
});

/**
 * # Schema Methods
 */
/**
 * ## Hash password before saving
 */
const SALT_WORK_FACTOR = 10;
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

/**
 * ## Validate password
 */
userSchema.methods.comparePassword = async function (candidatePassword) : Promise<boolean> {
  const password = this.password;
  try {
    const isValid = await bcrypt.compare(candidatePassword, this.password);
    return isValid;
  } catch (error) {
    return error;
  }
};

/**
 * # Model
 */
const user : Model<UserModel> = model('users', userSchema);

user.create({
  username: 'admin',
  role: 'admin',
  password: 'root',
  email: 'simoknott@gmail.com',
  children: [],
});

export default user;
