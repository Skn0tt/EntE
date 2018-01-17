import { Record, Map, List } from 'immutable';

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
  PARENT = 'parent',
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

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

export class User extends Record({
  _id: '',
  username: '',
  displayname: '',
  email: '',
  role: '',
  isAdult: false,
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

export class Slot extends Record({
  _id: '',
  date: new Date(0),
  hour_from: -1,
  hour_to: -1,
  signed: false,
  student: '',
  teacher: '',
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
  dateEnd?: Date;
  reason: string;
  student: MongoId;
  slots: MongoId[];
  forSchool: boolean;
  signedManager: boolean;
  signedParent: boolean;
}

export interface IEntryCreate {
  date: Date;
  dateEnd?: Date;
  reason?: string;
  student?: MongoId;
  slots: ISlotCreate[];
  forSchool: boolean;
}

export class Entry extends Record({
  _id: '',
  date: new Date(),
  dateEnd: new Date(),
  reason: '',
  student: '',
  slots: [],
  forSchool: false,
  signedManager: false,
  signedParent: false,
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
export interface ICredentials {
  username: string;
  password: string;
}
export interface IAuth extends ICredentials {
  role: Roles;
  displayname: string;
  checked: boolean;
  children: MongoId[];
}

export interface INewPassword {
  token: string;
  password: string;
}

export class AuthState extends Record({
  username: '',
  password: '',
  displayname: '',
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
 * Messages
 */
type MessagesState = List<String>;

/**
 * AppState
 */
export interface IAppState {
  entries: Map<MongoId, Entry>;
  users: Map<MongoId, User>;
  slots: Map<MongoId, Slot>;
  auth: AuthState;
  messages: MessagesState;
  loading: number;
}

export class AppState extends Record({
  entries: Map<MongoId, Entry>(),
  users: Map<MongoId, User>(),
  slots: Map<MongoId, Slot>(),
  auth: new AuthState({}),
  messages: List<string>(),
  loading: 0,
}) {
  constructor(props: Partial<IAppState>) {
    super(props);
  }
  get<T extends keyof IAppState>(value: T): IAppState[T] {
    return super.get(value);
  }
}
