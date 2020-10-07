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
  BlackedEntryDto,
  BlackedSlotDto,
  BlackedUserDto,
  UserDto,
  Languages,
  roleIsTeaching,
  dateToIsoString,
  DEFAULT_DEFAULT_LANGUAGE,
  ParentSignatureTimesDto,
  DEFAULT_PARENT_SIGNATURE_EXPIRY_TIME,
  DEFAULT_PARENT_SIGNATURE_NOTIFICATION_TIME,
  DEFAULT_ENTRY_CREATION_DEADLINE,
  EntryReasonCategory,
} from "@@types";
import { Action } from "redux";
import { FilterScope } from "../filter-scope";
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
  users: Map<string, UserN>;
  entries: Map<string, EntryN>;
  slots: Map<string, SlotN>;
}

/**
 * User
 */
interface UserDtoNormalised extends BlackedUserDto {
  childrenIds: string[];
}

interface EntryDtoNormalised extends BlackedEntryDto {
  studentId: string;
  slotIds: string[];
  isInReviewedRecords: boolean;
}

interface SlotDtoNormalised extends BlackedSlotDto {
  studentId: string;
  teacherId: string | null;
  isInReviewedRecords: boolean;
}

export type ParentSignatureTimesN = ImmutableRecord<ParentSignatureTimesDto>;
export const ParentSignatureTimesN = ImmutableRecord<ParentSignatureTimesDto>(
  {
    expiry: DEFAULT_PARENT_SIGNATURE_EXPIRY_TIME,
    notification: DEFAULT_PARENT_SIGNATURE_NOTIFICATION_TIME,
  },
  "ParentSignatureTimesN"
);

interface InstanceConfigRecord {
  defaultLanguage: Languages;
  loginBanners: Map<Languages, string>;
  parentSignatureTimes: ParentSignatureTimesN;
  entryCreationDeadline: number;
  hiddenEntryReasonCategories: EntryReasonCategory[];
}

export type InstanceConfigN = ImmutableRecord<InstanceConfigRecord>;
export const InstanceConfigN = ImmutableRecord<InstanceConfigRecord>(
  {
    defaultLanguage: DEFAULT_DEFAULT_LANGUAGE,
    loginBanners: Map(),
    parentSignatureTimes: ParentSignatureTimesN(),
    entryCreationDeadline: DEFAULT_ENTRY_CREATION_DEADLINE,
    hiddenEntryReasonCategories: [],
  },
  "InstanceConfigN"
);

export type UserN = ImmutableRecord<UserDtoNormalised>;
export const UserN = ImmutableRecord<UserDtoNormalised>(
  {
    id: "",
    username: "",
    children: undefined,
    firstName: "",
    lastName: "",
    displayname: "",
    email: undefined,
    birthday: undefined,
    role: Roles.STUDENT,
    isAdmin: false,
    childrenIds: [],
    class: undefined,
    language: undefined,
    managerNotes: undefined,
    subscribedToWeeklySummary: undefined,
    twoFAenabled: false,
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
export const roleHasClass = (r: Roles) =>
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
    signedManagerDate: null,
    signedParent: false,
    signedParentDate: null,
    managerReachedOut: false,
    slots: [],
    slotIds: [],
    student: (null as unknown) as UserDto,
    studentId: "",
    updatedAt: new Date().toISOString(),
    isInReviewedRecords: false,
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
    isPrefiled: false,
    studentId: "",
    teacherId: null,
    to: 0,
    forSchool: false,
    isEducational: false,
    isInReviewedRecords: false,
  },
  "SlotN"
);

/**
 * Auth
 */
interface IAuthState {
  token: string;
  exp: Date;
}

export type AuthState = ImmutableRecord<IAuthState>;
export const AuthState = ImmutableRecord<IAuthState>(
  {
    exp: new Date(),
    token: "",
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
  oneSelf: UserN | null;
  instanceConfig: InstanceConfigN | null;
  pendingActions: PendingActions;
  timeScope: FilterScope;
  colorScheme: ColorScheme;
  reviewedRecords: Set<string> | null;
}

export type AppState = ImmutableRecord<IAppState>;
export const AppState = ImmutableRecord<IAppState>(
  {
    entriesMap: Map<string, EntryN>(),
    usersMap: Map<string, UserN>(),
    slotsMap: Map<string, SlotN>(),
    auth: null,
    oneSelf: null,
    instanceConfig: null,
    pendingActions: Set<Action>(),
    timeScope: "everything",
    colorScheme: "system",
    reviewedRecords: null,
  },
  "AppState"
);
