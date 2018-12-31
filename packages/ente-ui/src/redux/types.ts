/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { Map, Record, Set } from "immutable";
import { Roles, UserDto, EntryDto, SlotDto, Languages } from "ente-types";
import { Action } from "redux";
import { getConfig } from "./config";

export interface BasicCredentials {
  username: string;
  password: string;
}

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
  teacherId: string | null;
}

export type UserN = Record<UserDtoNormalised>;
export const UserN = Record<UserDtoNormalised>(
  {
    id: "",
    username: "",
    children: [],
    displayname: "",
    email: "",
    birthday: undefined,
    role: Roles.STUDENT,
    childrenIds: [],
    graduationYear: undefined,
    language: getConfig().defaultLanguage
  },
  "UserN"
);

export const userIsManager = (u: UserN) => u.get("role") === Roles.MANAGER;
export const userIsParent = (u: UserN) => u.get("role") === Roles.PARENT;
export const userIsStudent = (u: UserN) => u.get("role") === Roles.STUDENT;
export const userIsTeacher = (u: UserN) => u.get("role") === Roles.TEACHER;
export const userHasChildren = (u: UserN) => userIsParent(u);
export const roleHasChildren = (r: Roles) => r === Roles.PARENT;
export const roleHasGradYear = (r: Roles) =>
  [Roles.MANAGER, Roles.STUDENT].includes(r);

export type EntryN = Record<EntryDtoNormalised>;
export const EntryN = Record<EntryDtoNormalised>(
  {
    createdAt: new Date(),
    date: new Date(),
    forSchool: false,
    id: "",
    signedManager: false,
    signedParent: false,
    slots: [],
    slotIds: [],
    student: (null as unknown) as UserDto,
    studentId: "",
    updatedAt: new Date()
  },
  "EntryN"
);

export type SlotN = Record<SlotDtoNormalised>;
export const SlotN = Record<SlotDtoNormalised>(
  {
    date: new Date(),
    from: 0,
    id: "",
    signed: false,
    student: (null as unknown) as UserDto,
    teacher: null,
    studentId: "",
    teacherId: null,
    to: 0,
    forSchool: false
  },
  "SlotN"
);

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
  userId: string;
}

export type AuthState = Record<IAuthState>;
export const AuthState = Record<IAuthState>(
  {
    children: [],
    displayname: "",
    exp: new Date(),
    role: Roles.STUDENT,
    username: "",
    token: "",
    userId: ""
  },
  "AuthState"
);

export type PendingActions = Set<Action>;

/**
 * AppState
 */
export interface IAppState {
  entriesMap: Map<string, EntryN>;
  usersMap: Map<string, UserN>;
  slotsMap: Map<string, SlotN>;
  auth: AuthState | null;
  language: Languages;
  pendingActions: PendingActions;
}

export type AppState = Record<IAppState>;
export const AppState = Record<IAppState>(
  {
    entriesMap: Map<string, EntryN>(),
    usersMap: Map<string, UserN>(),
    slotsMap: Map<string, SlotN>(),
    auth: null,
    language: getConfig().defaultLanguage,
    pendingActions: Set<Action>()
  },
  "AppState"
);
