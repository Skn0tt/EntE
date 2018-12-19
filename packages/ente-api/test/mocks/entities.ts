import { UserDto, EntryDto, Roles, CreateEntryDto, SlotDto } from "ente-types";
import { RequestContextUser } from "../../src/helpers/request-context";
import { Some, Maybe } from "monet";

const withGetDto = <T extends {}>(
  object: T
): T & { getDto: () => Promise<Maybe<T>> } => {
  const getDto = async () => Some(object);
  return Object.assign(object, { getDto });
};

const admin: UserDto & RequestContextUser = withGetDto({
  children: [],
  childrenIds: [],
  displayname: "Admin",
  email: "admin@gmail.com",
  id: "1cf900d1-2c1e-4178-907a-23e327f11d05",
  isAdult: false,
  role: Roles.ADMIN,
  username: "admin"
});

const tomTallis: UserDto & RequestContextUser = withGetDto({
  children: [],
  childrenIds: [],
  displayname: "Thomas Tallis",
  email: "tom@tallis.de",
  id: "1cf900d1-2c1e-4178-907a-23e327f11d05",
  isAdult: false,
  role: Roles.STUDENT,
  username: "tomtallis"
});

const benBongo: UserDto & RequestContextUser = withGetDto({
  children: [],
  childrenIds: [],
  displayname: "Mr. Bongo",
  email: "bongo@my-school.com",
  id: "1cf900d1-2c1e-4178-907a-23e327f11d05",
  isAdult: false,
  role: Roles.TEACHER,
  username: "benbongo"
});

const slot: SlotDto = {
  id: "1cf900d1-2c1e-4178-907a-23e327f11d05",
  date: new Date(),
  from: 3,
  to: 4,
  teacher: benBongo,
  signed: false,
  student: tomTallis
};

const entry: EntryDto = {
  id: "1cf900d1-2c1e-4178-907a-23e327f11d05",
  date: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  forSchool: false,
  signedManager: false,
  signedParent: false,
  student: tomTallis,
  slots: [slot]
};

const createEntry: CreateEntryDto = {
  date: new Date(),
  forSchool: false,
  slots: [
    {
      from: 1,
      teacherId: benBongo.id,
      to: 1,
      date: new Date()
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
