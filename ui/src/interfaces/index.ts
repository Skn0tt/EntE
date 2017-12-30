import { Record, Map } from 'immutable';

export type errorPayload = {};
export type MongoId = string;

/**
 * API
 */

export interface APIResponse {
  auth?: AuthState;
  users: User[];
  entries: Entry[];
  slots: Slot[];
}
export interface IAPIResponse {
  auth?: {
    role: Roles;
    children: MongoId[];
  };
  users: IUser[];
  entries: IEntry[];
  slots: ISlot[];
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
  children: MongoId[];
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
  student: MongoId;
  teacher: MongoId;
}

export class Slot extends Record({
  _id: '',
  date: new Date(0),
  hour_from: -1,
  hour_to: -1,
  student: '',
  teacher: ''
}) {
  constructor(props: Partial<ISlot>) {
    super(props);
  }
  get<T extends keyof ISlot>(value: T): ISlot[T] {
    return super.get(value);
  }
}

export const createSlot = (item: Partial<ISlot>) => new Slot(item);

/**
 * Entry
 */
export interface IEntry {
  _id: MongoId;
  date: Date;
  student: MongoId;
  slots: MongoId[];
  forSchool: boolean;
  signedAdmin: boolean;
  signedParent: boolean;
}

export class Entry extends Record({
  _id: '',
  date: new Date(0),
  student: '',
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

/**
 * Auth
 */
// TODO: Dont save pw in clearform!!!!
export interface ICredentials {
  username: string;
  password: string;
}
export interface IAuth extends ICredentials {
  role: Roles;
  checked: boolean;
  children: MongoId[];
}

export class AuthState extends Record({
  username: '',
  password: '',
  role: '',
  children: [],
  checked: false,
}) {
  constructor(props: Partial<IAuth>) {
    super(props);
  }
  get<T extends keyof IAuth>(value: T): IAuth[T] {
    return super.get(value);
  }
}

/**
 * Error
 */
type ErrorState = Error[];

/**
 * AppState
 */
export interface IAppState {
  entries: Map<MongoId, Entry>;
  users: Map<MongoId, User>;
  slots: Map<MongoId, Slot>;
  auth: AuthState;
  errors: ErrorState;
  loading: number;
}

export class AppState extends Record({
  entries: Map<MongoId, Entry>(),
  users: Map<MongoId, User>(),
  slots: Map<MongoId, Slot>(),
  auth: new AuthState({}),
  errors: [],
  loading: 0,
}) {
  constructor(props: Partial<IAppState>) {
    super(props);
  }
  get<T extends keyof IAppState>(value: T): IAppState[T] {
    return super.get(value);
  }
}
