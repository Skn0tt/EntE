import { Record, Map } from 'immutable';

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
  children: Partial<IUserAPI>[];
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

export const createUser = (item: Partial<IUserAPI>): User => new User({
  _id: item._id,
  children: item.children ? item.children.map(child => createUser(child)) : [],
  email: item.email,
  role: item.role,
  username: item.username
});

/**
 * Slot
 */
export interface ISlot {
  _id: MongoId;
  date: Date;
  hour_from: number;
  hour_to: number;
  signed: boolean;
  student: User;
  teacher: User;
}

export interface ISlotAPI {
  _id: MongoId;
  date: Date;
  hour_from: number;
  hour_to: number;
  signed: boolean;
  student: Partial<IUserAPI>;
  teacher: Partial<IUserAPI>;
}

export class Slot extends Record({
  _id: '',
  date: new Date(0),
  hour_from: -1,
  hour_to: -1,
  student: new User({}),
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

export const createSlot = (item: Partial<ISlotAPI>) => new Slot({
  _id: item._id as string,
  date: item.date ? new Date(item.date) : undefined,
  hour_from: item.hour_from,
  hour_to: item.hour_to,
  signed: item.signed,
  student: item.student ? createUser(item.student) : undefined,
  teacher: item.teacher ? createUser(item.teacher) : undefined,
});

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

export const createEntry = (item: Partial<IEntryAPI>) => new Entry({
  _id: item._id as string,
  slots: item.slots ? item.slots.map((slot) => createSlot(slot)) as Slot[] : [],
  forSchool: item.forSchool as boolean,
  date: item.date ? new Date(item.date) : undefined,
  signedAdmin: item.signedAdmin as boolean,
  signedParent: item.signedParent as boolean,
  student: item.student ? createUser(item.student) : undefined,
});

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
  children: User[];
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
