import {
  UserDto,
  EntryDto,
  Roles,
  CreateEntryDto,
  SlotDto,
  Languages,
  EntryReasonCategory,
} from "../../types";
import { Some, Maybe } from "monet";
import { RequestContextUser } from "../../backend/helpers/request-context";

const withGetDto = <T extends {}>(
  object: T
): T & { getDto: () => Promise<Maybe<T>> } => {
  const getDto = async () => Some(object);
  return { ...object, getDto };
};

const admin: UserDto & RequestContextUser = withGetDto({
  children: [],
  childrenIds: [],
  firstName: "Achim",
  lastName: "Admin",
  displayname: "Admin",
  email: "admin@gmail.com",
  id: "1cf900d1-2c1e-4178-907a-23e327f11d05",
  birthday: undefined,
  language: Languages.ENGLISH,
  role: Roles.MANAGER,
  isAdmin: true,
  username: "admin",
  twoFAenabled: false,
});

const tomTallis: UserDto & RequestContextUser = withGetDto({
  children: [],
  childrenIds: [],
  firstName: "Thomas",
  lastName: "Thallis",
  displayname: "Thomas Tallis",
  email: "tom@tallis.de",
  id: "1cf900d1-2c1e-4178-907a-23e327f11d05",
  birthday: "2000-02-01",
  language: Languages.ENGLISH,
  role: Roles.STUDENT,
  isAdmin: false,
  username: "tomtallis",
  twoFAenabled: false,
});

const benBongo: UserDto & RequestContextUser = withGetDto({
  children: [],
  childrenIds: [],
  firstName: "Ben",
  lastName: "Bongo",
  displayname: "Ben Bongo",
  email: "bongo@my-school.com",
  id: "1cf900d1-2c1e-4178-907a-23e327f11d06",
  birthday: undefined,
  language: Languages.ENGLISH,
  role: Roles.TEACHER,
  isAdmin: false,
  username: "benbongo",
  twoFAenabled: false,
});

const slot: SlotDto = {
  id: "1cf900d1-2c1e-4178-904a-23e327f11d05",
  date: "2018-12-26",
  from: 3,
  to: 4,
  isPrefiled: false,
  hasBeenPrefiled: false,
  teacher: benBongo,
  signed: false,
  student: tomTallis,
  forSchool: false,
  isEducational: false,
};

const entry: EntryDto = {
  id: "1cf900d1-2c1e-4178-903a-23e327f11d05",
  date: "2018-12-26",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  reason: {
    category: EntryReasonCategory.ILLNESS,
    payload: {},
  },
  managerReachedOut: false,
  signedManager: false,
  signedParent: false,
  signedManagerDate: null,
  signedParentDate: null,
  student: tomTallis,
  slots: [slot],
};

const createEntry: CreateEntryDto = {
  date: "2018-12-03",
  reason: {
    category: EntryReasonCategory.ILLNESS,
    payload: {},
  },
  prefiledSlots: [],
  slots: [
    {
      from: 1,
      teacherId: benBongo.id,
      to: 1,
    },
  ],
};

export const mocks = {
  users: {
    admin,
    students: {
      tomTallis,
    },
    teachers: {
      benBongo,
    },
    allUsers: [admin, tomTallis, benBongo],
  },
  entries: {
    entry,
  },
  slots: {
    slot,
  },
  createEntry,
};
