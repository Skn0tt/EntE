/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import { Map, Record as ImmutableRecord, Set } from "immutable";
import {
  Roles,
  UserDto,
  EntryDto,
  SlotDto,
  Languages,
  roleIsTeaching,
  dateToIsoString,
  DEFAULT_DEFAULT_LANGUAGE,
  ParentSignatureTimesDto,
  DEFAULT_PARENT_SIGNATURE_EXPIRY_TIME,
  DEFAULT_PARENT_SIGNATURE_NOTIFICATION_TIME,
  DEFAULT_ENTRY_CREATION_DEADLINE
} from "ente-types";
import { Action } from "redux";
import { TimeScope } from "../time-scope";
import { ColorScheme } from "../theme";

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

export type ParentSignatureTimesN = ImmutableRecord<ParentSignatureTimesDto>;
export const ParentSignatureTimesN = ImmutableRecord<ParentSignatureTimesDto>(
  {
    expiry: DEFAULT_PARENT_SIGNATURE_EXPIRY_TIME,
    notification: DEFAULT_PARENT_SIGNATURE_NOTIFICATION_TIME
  },
  "ParentSignatureTimesN"
);

interface InstanceConfigRecord {
  defaultLanguage: Languages;
  loginBanners: Map<Languages, string>;
  parentSignatureTimes: ParentSignatureTimesN;
  entryCreationDeadline: number;
}

export type InstanceConfigN = ImmutableRecord<InstanceConfigRecord>;
export const InstanceConfigN = ImmutableRecord<InstanceConfigRecord>(
  {
    defaultLanguage: DEFAULT_DEFAULT_LANGUAGE,
    loginBanners: Map(),
    parentSignatureTimes: ParentSignatureTimesN(),
    entryCreationDeadline: DEFAULT_ENTRY_CREATION_DEADLINE
  },
  "InstanceConfigN"
);

export type UserN = ImmutableRecord<UserDtoNormalised>;
export const UserN = ImmutableRecord<UserDtoNormalised>(
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
    language: DEFAULT_DEFAULT_LANGUAGE
  },
  "UserN"
);

export const userIsManager = (u: UserN) => u.get("role") === Roles.MANAGER;
export const userIsParent = (u: UserN) => u.get("role") === Roles.PARENT;
export const userIsStudent = (u: UserN) => u.get("role") === Roles.STUDENT;
export const userIsTeacher = (u: UserN) => u.get("role") === Roles.TEACHER;
export const userIsTeaching = (u: UserN) => roleIsTeaching(u.get("role"));
export const userHasChildren = (u: UserN) => userIsParent(u);
export const roleHasChildren = (r: Roles) => r === Roles.PARENT;
export const roleHasGradYear = (r: Roles) =>
  [Roles.MANAGER, Roles.STUDENT].includes(r);

export type EntryN = ImmutableRecord<EntryDtoNormalised>;
export const EntryN = ImmutableRecord<EntryDtoNormalised>(
  {
    createdAt: new Date(0).toISOString(),
    date: dateToIsoString(0),
    dateEnd: undefined,
    id: "",
    reason: undefined as any,
    signedManager: false,
    signedParent: false,
    slots: [],
    slotIds: [],
    student: (null as unknown) as UserDto,
    studentId: "",
    updatedAt: new Date().toISOString()
  },
  "EntryN"
);

export type SlotN = ImmutableRecord<SlotDtoNormalised>;
export const SlotN = ImmutableRecord<SlotDtoNormalised>(
  {
    date: dateToIsoString(0),
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

export type AuthState = ImmutableRecord<IAuthState>;
export const AuthState = ImmutableRecord<IAuthState>(
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
  instanceConfig: InstanceConfigN | null;
  pendingActions: PendingActions;
  timeScope: TimeScope;
  colorScheme: ColorScheme;
}

export type AppState = ImmutableRecord<IAppState>;
export const AppState = ImmutableRecord<IAppState>(
  {
    entriesMap: Map<string, EntryN>(),
    usersMap: Map<string, UserN>(),
    slotsMap: Map<string, SlotN>(),
    auth: null,
    instanceConfig: null,
    pendingActions: Set<Action>(),
    timeScope: "everything",
    colorScheme: "light"
  },
  "AppState"
);
