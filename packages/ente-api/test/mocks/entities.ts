import {
  UserDto,
  EntryDto,
  Roles,
  CreateEntryDto,
  SlotDto,
  Languages
} from "ente-types";
import { RequestContextUser } from "../../src/helpers/request-context";
import { Some, Maybe } from "monet";

const withGetDto = <T extends {}>(
  object: T
): T & { getDto: () => Promise<Maybe<T>> } => {
  const getDto = async () => Some(object);
  return { ...object, getDto };
};

const admin: UserDto & RequestContextUser = withGetDto({
  children: [],
  childrenIds: [],
  displayname: "Admin",
  email: "admin@gmail.com",
  id: "1cf900d1-2c1e-4178-907a-23e327f11d05",
  birthday: undefined,
  language: Languages.ENGLISH,
  role: Roles.ADMIN,
  username: "admin"
});

const tomTallis: UserDto & RequestContextUser = withGetDto({
  children: [],
  childrenIds: [],
  displayname: "Thomas Tallis",
  email: "tom@tallis.de",
  id: "1cf900d1-2c1e-4178-907a-23e327f11d05",
  birthday: "2000-02-01",
  language: Languages.ENGLISH,
  role: Roles.STUDENT,
  username: "tomtallis"
});

const benBongo: UserDto & RequestContextUser = withGetDto({
  children: [],
  childrenIds: [],
  displayname: "Mr. Bongo",
  email: "bongo@my-school.com",
  id: "1cf900d1-2c1e-4178-907a-23e327f11d06",
  birthday: undefined,
  language: Languages.ENGLISH,
  role: Roles.TEACHER,
  username: "benbongo"
});

const slot: SlotDto = {
  id: "1cf900d1-2c1e-4178-904a-23e327f11d05",
  date: "2018-12-26",
  from: 3,
  to: 4,
  teacher: benBongo,
  signed: false,
  student: tomTallis,
  forSchool: false
};

const entry: EntryDto = {
  id: "1cf900d1-2c1e-4178-903a-23e327f11d05",
  date: "2018-12-26",
  createdAt: new Date(),
  updatedAt: new Date(),
  forSchool: false,
  signedManager: false,
  signedParent: false,
  student: tomTallis,
  slots: [slot]
};

const createEntry: CreateEntryDto = {
  date: "2018-12-03",
  forSchool: false,
  slots: [
    {
      from: 1,
      teacherId: benBongo.id,
      to: 1
    }
  ]
};

export const mocks = {
  users: {
    admin,
    students: {
      tomTallis
    },
    teachers: {
      benBongo
    },
    allUsers: [admin, tomTallis, benBongo]
  },
  entries: {
    entry
  },
  slots: {
    slot
  },
  createEntry
};
