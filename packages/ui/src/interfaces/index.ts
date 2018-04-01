import { Record, Map, List } from "immutable";
import { IUser, Roles, IEntry, ISlot, IAuth, MongoId } from "ente-types";

export type errorPayload = {};

/**
 * API
 */

export interface APIResponse {
  auth?: AuthState;
  users: User[];
  entries: Entry[];
  slots: Slot[];
}

/**
 * User
 */

export class User extends Record(
  {
    _id: "",
    username: "",
    displayname: "",
    email: "",
    role: "",
    isAdult: false,
    children: []
  },
  "User"
) {
  constructor(props: Partial<IUser>) {
    super(props);
  }
  get<T extends keyof IUser>(value: T): IUser[T] {
    return super.get(value);
  }

  isManager = () => this.get("role") === Roles.MANAGER;
  isParent = () => this.get("role") === Roles.PARENT;
  isAdmin = () => this.get("role") === Roles.ADMIN;
  isStudent = () => this.get("role") === Roles.STUDENT;
  isTeacher = () => this.get("role") === Roles.TEACHER;

  hasChildren = () => this.isManager() || this.isParent();
}

/**
 * Slot
 */

export class Slot extends Record(
  {
    _id: "",
    date: new Date(0),
    hour_from: -1,
    hour_to: -1,
    signed: false,
    student: "",
    teacher: ""
  },
  "Slot"
) {
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

export class Entry extends Record(
  {
    _id: "",
    date: new Date(),
    dateEnd: new Date(),
    reason: "",
    student: "",
    slots: [],
    forSchool: false,
    signedManager: false,
    signedParent: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  "Entry"
) {
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

export class AuthState extends Record(
  {
    token: "",
    exp: new Date(),
    displayname: "",
    role: "",
    children: []
  },
  "AuthState"
) {
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

export class AppState extends Record(
  {
    entries: Map<MongoId, Entry>(),
    users: Map<MongoId, User>(),
    slots: Map<MongoId, Slot>(),
    auth: new AuthState({}),
    messages: List<string>(),
    loading: 0
  },
  "AppState"
) {
  constructor(props: Partial<IAppState>) {
    super(props);
  }
  get<T extends keyof IAppState>(value: T): IAppState[T] {
    return super.get(value);
  }
}
