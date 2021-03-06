import { normalizeUsers, normalizeEntries, normalizeSlots } from "./api";
import {
  UserDto,
  Roles,
  EntryDto,
  SlotDto,
  Languages,
  dateToIsoString,
  EntryReasonCategory,
} from "@@types";

const simon: UserDto = {
  firstName: "Simon",
  lastName: "Knott",
  displayname: "Simon Knott",
  email: "info@simonknott.de",
  birthday: "2100-01-01",
  id: "abc",
  role: Roles.STUDENT,
  isAdmin: false,
  children: [],
  username: "skn0tt",
  twoFAenabled: false,
  language: Languages.ENGLISH,
};
const susanne: UserDto = {
  displayname: "Susanne Susanne",
  firstName: "Susanne",
  lastName: "Susanne",
  language: Languages.ENGLISH,
  children: [simon],
  email: "susanne@simonknott.de",
  id: "asdaj",
  isAdmin: false,
  birthday: undefined,
  role: Roles.PARENT,
  twoFAenabled: false,
  username: "susan",
};
const benni: UserDto = {
  displayname: "Benni Brecht",
  firstName: "Benni",
  lastName: "Brecht",
  language: Languages.ENGLISH,
  children: [],
  email: "benni@simonknott.de",
  id: "asjd",
  isAdmin: false,
  birthday: undefined,
  role: Roles.TEACHER,
  twoFAenabled: false,
  username: "benny",
};

const slot: SlotDto = {
  date: dateToIsoString(0),
  from: 0,
  id: "jkdas",
  signed: false,
  isPrefiled: false,
  hasBeenPrefiled: false,
  teacher: benni,
  student: simon,
  forSchool: true,
  isEducational: true,
  to: 1,
};

const entry: EntryDto = {
  createdAt: new Date(0).toISOString(),
  date: dateToIsoString(0),
  reason: {
    category: EntryReasonCategory.OTHER_EDUCATIONAL,
    payload: { description: "some_description" },
  },
  id: "jkdas",
  managerReachedOut: false,
  signedManager: false,
  signedParent: false,
  signedManagerDate: null,
  signedParentDate: null,
  slots: [slot],
  student: simon,
  updatedAt: new Date(0).toISOString(),
};

describe("normalizeUsers", () => {
  describe("when given empty array", () => {
    it("returns an empty APIResponse", () => {
      const result = normalizeUsers();
      expect(result.entries.size).toBe(0);
      expect(result.users.size).toBe(0);
      expect(result.slots.size).toBe(0);
    });
  });

  describe("when given values", () => {
    it("returns the normalised values", () => {
      const result = normalizeUsers(susanne);
      expect(result.entries.size).toBe(0);
      expect(result.users.size).toBe(2);
      expect(result.slots.size).toBe(0);
    });
  });
});

describe("normalizeEntries", () => {
  describe("when given empty array", () => {
    it("returns empty response", () => {
      const result = normalizeEntries();
      expect(result.entries.size).toBe(0);
      expect(result.users.size).toBe(0);
      expect(result.slots.size).toBe(0);
    });
  });

  describe("when given values array", () => {
    it("returns normalised response", () => {
      const result = normalizeEntries(entry);
      expect(result.entries.size).toBe(1);
      expect(result.users.size).toBe(2);
      expect(result.slots.size).toBe(1);
    });
  });
});

describe("normalizeSlots", () => {
  describe("when given empty array", () => {
    it("returns empty response", () => {
      const result = normalizeSlots();
      expect(result.entries.size).toBe(0);
      expect(result.users.size).toBe(0);
      expect(result.slots.size).toBe(0);
    });
  });

  describe("when given values array", () => {
    it("returns normalised response", () => {
      const result = normalizeSlots(slot);
      expect(result.entries.size).toBe(0);
      expect(result.users.size).toBe(2);
      expect(result.slots.size).toBe(1);
    });
  });
});
