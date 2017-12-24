import { Record } from 'immutable';

export type errorPayload = {};
export type MongoId = string;

/**
 * User
 */
export enum Roles {
  PARENT = 'parent',
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export interface IUser {
  _id: MongoId;
  username: string;
  email: string;
  role: Roles;
  children: User[];
}

export interface IUserAPI {
  _id: MongoId;
  username: string;
  email: string;
  role: Roles;
  children: IUserAPI[];
}

export interface IUserCreate {
  username: string;
  email: string;
  role: Roles;
  children: User[];
}

export class User extends Record({}) {
  constructor(props: IUser) {
    super(props);
  }
  get<T extends keyof IUser>(value: T): IUser[T] {
    return super.get(value);
  }
}

/**
 * Slot
 */
export interface ISlot {
  _id: MongoId;
  date: Date;
  hour_from: number;
  hour_to: number;
  signed: boolean;
  teacher: User;
}

export interface ISlotAPI {
  _id: MongoId;
  date: Date;
  hour_from: number;
  hour_to: number;
  signed: boolean;
  teacher: IUserAPI;
}

export class Slot extends Record({}) {
  constructor(props: ISlot) {
    super(props);
  }
  get<T extends keyof ISlot>(value: T): ISlot[T] {
    return super.get(value);
  }
}

/**
 * Entry
 */
export interface IEntry {
  _id: MongoId;
  date: Date;
  student: User;
  slots: Slot[];
  forSchool: boolean;
  signedAdmin: boolean;
  signedParent: boolean;
}

export interface IEntryAPI {
  _id: MongoId;
  date: Date;
  student: IUserAPI;
  slots: ISlotAPI[];
  forSchool: boolean;
  signedAdmin: boolean;
  signedParent: boolean;
}

export interface IEntryCreate {
  date: Date;
  slots: Slot[];
  forSchool: boolean;
}

export class Entry extends Record({}) {
  constructor(props: IEntry) {
    super(props);
  }
  get<T extends keyof IEntry>(value: T): IEntry[T] {
    return super.get(value);
  }
}
