import { Schema, model, Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as validate from 'mongoose-validator';
import * as idValidator from 'mongoose-id-validator';
import * as uniqueValidator from 'mongoose-unique-validator';

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
 * # Validators
 */
const usernameValidator = [
  validate({
    validator: 'isAlphanumeric',
    message: 'Username should contain alpha-numeric characters only',
  }),
];

const displaynameValidator = [
  validate({
    validator: 'isAlphanumeric',
    message: 'Dislpayname should contain alpha-numeric characters only',
  }),
];

const emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'email should be a valid Email Address.',
  }),
];

/**
 * # Schema
 */
const userSchema : Schema = new Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true },
    validate: usernameValidator,
    minlength: 3,
    maxlength: 50,
  },
  displayname: {
    type: String,
    required: true,
    validate: displaynameValidator,
    minlength: 3,
    maxlength: 50,
  },
  email: { type: String, required: false, validate: emailValidator },
  password: { type: String, required: true },
  role: { type: String, enum: roles, required: true },
  children: [{ type: Schema.Types.ObjectId, ref: 'users' }],
}, {
  versionKey: false,
});

userSchema.plugin(idValidator);
userSchema.plugin(uniqueValidator);

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
  displayname: 'Administrator',
  password: 'root',
  email: 'simoknott@gmail.com',
  children: [],
});

export default user;
