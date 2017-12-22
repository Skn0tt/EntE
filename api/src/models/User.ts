import { Schema, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { ROLES } from '../constants';

/**
 * # Schema
 */

const UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  type: { type: String, enum: ROLES, required: true }
});

/**
 * # Schema Methods
 */
/**
 * ## Hash password before saving
 */
const SALT_WORK_FACTOR = 10;
UserSchema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      
      user.password = hash;
      next();
    });
  });
});

/**
 * ## Validate password
 */
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) return callback(err);
      callback(null, isMatch);
  });
};

/**
 * # Model
 */
const User = model('users', UserSchema);

export default User;
