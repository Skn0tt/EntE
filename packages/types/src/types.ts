export type errorPayload = {};
export type MongoId = string;

/**
 * API
 */

export interface IAPIResponse {
  auth?: {
    displayname: string;
    role: Roles;
    children: MongoId[];
  };
  users?: IUser[];
  entries?: IEntry[];
  slots?: ISlot[];
}

/**
 * User
 */
export enum Roles {
  PARENT = "parent",
  STUDENT = "student",
  TEACHER = "teacher",
  ADMIN = "admin",
  MANAGER = "manager"
}

export const rolesArr = Object.keys(Roles).map(key => Roles[key]);

export interface IUserBase {
  username: string;
  email: string;
  children: MongoId[];
  role: Roles;
  isAdult: boolean;
  displayname: string;
}

export interface IUserCreate extends IUserBase {
  password: string;
}

export interface IUser extends IUserBase {
  _id: MongoId;
}

/**
 * Slot
 */
export interface ISlot extends ISlotCreate {
  _id: MongoId;
  student: MongoId;
  date: Date;
  signed: boolean;
}

export interface ISlotCreate {
  hour_from: number;
  hour_to: number;
  teacher: MongoId;
}

/**
 * Entry
 */
export interface IEntry {
  _id: MongoId;
  date: Date;
  dateEnd?: Date;
  reason: string;
  student: MongoId;
  slots: MongoId[];
  forSchool: boolean;
  signedManager: boolean;
  signedParent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEntryCreate {
  date: Date;
  dateEnd?: Date;
  reason?: string;
  student?: MongoId;
  slots: ISlotCreate[];
  forSchool: boolean;
}

/**
 * Auth
 */
export interface TokenInfo {
  token: string;
  displayname: string;
  role: Roles;
  exp: Date;
  children: MongoId[];
}
export interface ICredentials {
  username: string;
  password: string;
}
export interface IAuth extends ICredentials {
  token: string;
  exp: Date;
  role: Roles;
  displayname: string;
  children: MongoId[];
}

export interface INewPassword {
  token: string;
  password: string;
}
