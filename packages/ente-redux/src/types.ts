/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { Record, Map, List } from "immutable";
import { Roles, UserDto, EntryDto, SlotDto } from "ente-types";
import { Maybe, None } from "monet";

export interface BasicCredentials {
  username: string;
  password: string;
}

const createRecord = <T>(defaultVal: T) =>
  class extends Record(defaultVal) {
    constructor(props: Partial<T>) {
      super(props);
    }
    get<V extends keyof T>(key: V, notSetValue?: V): T[V] {
      return super.get(key as string, notSetValue);
    }
    set<V extends keyof T & string>(key: V, value: T[V]): any {
      return super.set(key as string, value);
    }
  };

/**
 * API
 */

export interface APIResponse {
  auth?: AuthState;
  users: UserN[];
  entries: EntryN[];
  slots: SlotN[];
}

/**
 * User
 */
class UserDtoNormalised extends UserDto {
  childrenIds: string[];
}

class EntryDtoNormalised extends EntryDto {
  studentId: string;
  slotIds: string[];
}

class SlotDtoNormalised extends SlotDto {
  studentId: string;
  teacherId: string;
}

export class UserN extends createRecord<UserDtoNormalised>({
  id: "",
  username: "",
  children: [],
  displayname: "",
  email: "",
  isAdult: false,
  role: Roles.STUDENT,
  childrenIds: []
}) {}

export const userIsManager = (u: UserN) => u.get("role") === Roles.MANAGER;
export const userIsParent = (u: UserN) => u.get("role") === Roles.PARENT;
export const userIsStudent = (u: UserN) => u.get("role") === Roles.STUDENT;
export const userIsTeacher = (u: UserN) => u.get("role") === Roles.TEACHER;
export const userHasChildren = (u: UserN) =>
  userIsManager(u) || userIsParent(u);

export class EntryN extends createRecord<EntryDtoNormalised>({
  createdAt: new Date(),
  date: new Date(),
  forSchool: false,
  id: "",
  signedManager: false,
  signedParent: false,
  slots: [],
  slotIds: [],
  student: null,
  studentId: "",
  updatedAt: new Date()
}) {}

export class SlotN extends createRecord<SlotDtoNormalised>({
  date: new Date(),
  from: 0,
  id: "",
  signed: false,
  student: null,
  teacher: null,
  studentId: "",
  teacherId: "",
  to: 0
}) {}

/**
 * Auth
 */
interface IAuthState {
  token: string;
  exp: Date;
  displayname: string;
  username: string;
  role: Roles;
  children: string[];
}

export class AuthState extends createRecord<IAuthState>({
  children: [],
  displayname: "",
  exp: new Date(),
  role: Roles.STUDENT,
  username: "",
  token: ""
}) {}

/**
 * Messages
 */
type MessagesState = List<String>;

/**
 * AppState
 */
export interface IAppState {
  entries: Map<string, EntryN>;
  users: Map<string, UserN>;
  slots: Map<string, SlotN>;
  auth: Maybe<AuthState>;
  messages: MessagesState;
  loading: number;
}

export class AppState extends createRecord<IAppState>({
  entries: Map<string, EntryN>(),
  users: Map<string, UserN>(),
  slots: Map<string, SlotN>(),
  auth: None(),
  messages: List<string>(),
  loading: 0
}) {}
