import { Schema, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { roles } from '../constants';

/**
 * # Schema
 */
const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, enum: roles, required: true },
  children: { type: [Schema.Types.ObjectId], ref: 'users' },
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
userSchema.methods.comparePassword = function (candidatePassword) {
  const password = this.password;
  try {
    const isValid = bcrypt.compare(candidatePassword, this.password);
    return isValid;
  } catch (error) {
    return error;
  }
};

/**
 * # Model
 */
const user = model('users', userSchema);

user.create({
  username: 'admin',
  role: 'admin',
  password: 'root',
  email: 'simoknott@gmail.com',
  children: [],
});

export default user;
