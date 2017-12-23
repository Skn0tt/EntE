import { Record } from 'immutable';

/**
 * User
 */
export enum Roles {
  PARENT = 'parent',
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

export interface User {
  id: String;
  username: String;
  email: String;
  role: Roles;
  children: [User];
}

export class User extends Record({}) {
  constructor(props: User) {
    super(props);
  }
  get<T extends keyof User>(value: T): User[T] {
    return super.get(value);
  }
}

/**
 * Slot
 */
export interface Slot {
  id: String;
  date: Date;
  hour_from: Number;
  hour_to: Number;
  signed: boolean;
  teacher: User;
}

export class Slot extends Record({}) {
  constructor(props: Slot) {
    super(props);
  }
  get<T extends keyof Slot>(value: T): Slot[T] {
    return super.get(value);
  }
}

/**
 * Entry
 */
export interface Entry {
  id?: String;
  date?: Date;
  student?: User;
  slots: [Slot];
  forSchool: boolean;
  signedAdmin?: boolean;
  signedParent?: boolean;
}

export class Entry extends Record({}) {
  constructor(props: Entry) {
    super(props);
  }
  get<T extends keyof Entry>(value: T): Entry[T] {
    return super.get(value);
  }
}
