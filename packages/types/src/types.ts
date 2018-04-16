export type errorPayload = {};
export type MongoId = string;

/**
 * API
 */

export interface IAPIResponse {
  auth?: {
    displayname: string;
    role: Roles;
    children: UserId[];
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
  children: UserId[];
  role: Roles;
  isAdult: boolean;
  displayname: string;
}

export interface IUserCreate extends IUserBase {
  password?: string;
}

export type UserId = string;
export interface IUser extends IUserBase {
  _id: UserId;
}

/**
 * Slot
 */
export type SlotId = string;
export interface ISlot extends ISlotCreate {
  _id: SlotId;
  student: UserId;
  date: Date;
  signed: boolean;
}

export interface ISlotCreate {
  hour_from: number;
  hour_to: number;
  teacher: UserId;
}

/**
 * Entry
 */
export type EntryId = string;
export interface IEntry {
  _id: EntryId;
  date: Date;
  dateEnd?: Date;
  reason?: string;
  student: UserId;
  slots: SlotId[];
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
  student?: UserId;
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
  children: UserId[];
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
  children: UserId[];
}

export interface INewPassword {
  token: string;
  password: string;
}
