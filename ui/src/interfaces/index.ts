import { Record, Map } from 'immutable';

export type errorPayload = {};
export type MongoId = string;

/**
 * AppState
 */
export interface IAppState {
  entries: Map<MongoId, Entry>;
  users: Map<MongoId, User>;
  loading: number;
}

export class AppState extends Record({
  entries: Map<MongoId, Entry>(),
  users: Map<MongoId, User>(),
  loading: 0,
}) {
  constructor(props: Partial<IAppState>) {
    super(props);
  }
  get<T extends keyof IAppState>(value: T): IAppState[T] {
    return super.get(value);
  }
}

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

export class User extends Record({
  _id: '',
  username: '',
  email: '',
  role: '',
  children: [],
}) {
  constructor(props: Partial<IUser>) {
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

export class Slot extends Record({
  _id: '',
  date: new Date(0),
  hour_from: -1,
  hour_to: -1,
  signed: false,
  teacher: new User({})
}) {
  constructor(props: Partial<ISlot>) {
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

export class Entry extends Record({
  _id: '',
  date: new Date(0),
  student: new User({}),
  slots: [],
  forSchool: false,
  signedAdmin: false,
  signedParent: false
}) {
  constructor(props: Partial<IEntry>) {
    super(props);
  }
  get<T extends keyof IEntry>(value: T): IEntry[T] {
    return super.get(value);
  }
}
