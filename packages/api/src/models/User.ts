import { Schema, model, Document, Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as validate from "mongoose-validator";
import * as idValidator from "mongoose-id-validator";
import * as uniqueValidator from "mongoose-unique-validator";
import * as crypto from "crypto";

import { dispatchPasswortResetLink } from "../helpers/mail";
import { MongoId, Roles, rolesArr } from "ente-types";

export interface UserModel extends Document, IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
  forgotPassword();
}

export interface IUser extends IUserBase {
  children: MongoId[];
  resetPasswordToken: String;
  resetPasswordExpires: Date;
}

export interface IUserCreate extends IUserBase {
  children: string[];
}

interface IUserBase {
  username: string;
  displayname: string;
  email: string;
  password: string;
  role: Roles;
  isAdult?: boolean;
}

/**
 * # Schema
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      index: { unique: true },
      minlength: 3,
      maxlength: 50
    },
    displayname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    email: { type: String, required: false },
    password: String,
    role: { type: String, enum: rolesArr, required: true },
    isAdult: { type: Boolean, required: false, default: false },
    children: [{ type: Schema.Types.ObjectId, ref: "users" }],
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  {
    versionKey: false
  }
);

userSchema.plugin(idValidator);
userSchema.plugin(uniqueValidator);

/**
 * # Schema Methods
 */
/**
 * ## Hash password before saving
 */
const SALT_WORK_FACTOR = 10;
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next();

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
userSchema.methods.comparePassword = async function(
  candidatePassword
): Promise<boolean> {
  if (!this.password) {
    return false;
  }

  try {
    const isValid = await bcrypt.compare(candidatePassword, this.password);
    return isValid;
  } catch (error) {
    return error;
  }
};

/**
 * ## Forgot Password Routine
 */
userSchema.methods.forgotPassword = async function(): Promise<void> {
  const buffer = await crypto.randomBytes(30);
  const token = buffer.toString("hex");

  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

  dispatchPasswortResetLink(token, this.username, this.email);

  await this.save();
};

/**
 * # Model
 */
const user: Model<UserModel> = model("users", userSchema);

user.create({
  username: "admin",
  role: "admin",
  displayname: "Administrator",
  password: "root",
  email: "simoknott@gmail.com",
  children: []
});

export default user;
