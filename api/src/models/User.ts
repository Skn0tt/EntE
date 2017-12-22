import { Schema, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { ROLES } from '../constants';

/**
 * # Schema
 */
const types = [ROLES.ADMIN, ROLES.PARENT, ROLES.STUDENT, ROLES.TEACHER];
const userSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  type: { type: String, enum: types, required: true },
});

/**
 * # Schema Methods
 */
/**
 * ## Hash password before saving
 */
const SALT_WORK_FACTOR = 10;
userSchema.pre('save', function (next) {

  if (!this.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (!!err) return next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (!!err) return next(err);
      
      this.password = hash;
      next();
    });
  });
});

/**
 * ## Validate password
 */
userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

/**
 * # Model
 */
const user = model('users', userSchema);

export default user;
