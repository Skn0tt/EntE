import { transformUsers, transformEntries, transformSlots } from "./api";
import { UserDto, Roles, EntryDto, SlotDto } from "ente-types";

const simon: UserDto = {
  displayname: "Simon",
  email: "info@simonknott.de",
  isAdult: false,
  id: "abc",
  role: Roles.STUDENT,
  children: [],
  username: "skn0tt"
};
const susanne: UserDto = {
  displayname: "Susanne",
  children: [simon],
  email: "susanne@simonknott.de",
  id: "asdaj",
  isAdult: true,
  role: Roles.PARENT,
  username: "susan"
};
const benni: UserDto = {
  displayname: "Benni",
  children: [],
  email: "benni@simonknott.de",
  id: "asjd",
  isAdult: true,
  role: Roles.TEACHER,
  username: "benny"
};

const slot: SlotDto = {
  date: new Date(),
  from: 0,
  id: "jkdas",
  signed: false,
  teacher: benni,
  student: simon,
  to: 1
};

const entry: EntryDto = {
  createdAt: new Date(),
  date: new Date(),
  forSchool: true,
  id: "jkdas",
  signedManager: false,
  signedParent: false,
  slots: [slot],
  student: simon,
  updatedAt: new Date()
};

describe("transformUsers", () => {
  describe("when given empty array", () => {
    it("returns an empty APIResponse", () => {
      const result = transformUsers();
      expect(result.entries).toHaveLength(0);
      expect(result.users).toHaveLength(0);
      expect(result.slots).toHaveLength(0);
    });
  });

  describe("when given values", () => {
    it("returns the normalised values", () => {
      const result = transformUsers(susanne);
      expect(result.entries).toHaveLength(0);
      expect(result.users).toHaveLength(2);
      expect(result.slots).toHaveLength(0);
    });
  });
});

describe("transformEntries", () => {
  describe("when given empty array", () => {
    it("returns empty response", () => {
      const result = transformEntries();
      expect(result.entries).toHaveLength(0);
      expect(result.users).toHaveLength(0);
      expect(result.slots).toHaveLength(0);
    });
  });

  describe("when given values array", () => {
    it("returns normalised response", () => {
      const result = transformEntries(entry);
      expect(result.entries).toHaveLength(1);
      expect(result.users).toHaveLength(2);
      expect(result.slots).toHaveLength(1);
    });
  });
});

describe("transformSlots", () => {
  describe("when given empty array", () => {
    it("returns empty response", () => {
      const result = transformSlots();
      expect(result.entries).toHaveLength(0);
      expect(result.users).toHaveLength(0);
      expect(result.slots).toHaveLength(0);
    });
  });

  describe("when given values array", () => {
    it("returns normalised response", () => {
      const result = transformSlots(slot);
      expect(result.entries).toHaveLength(0);
      expect(result.users).toHaveLength(2);
      expect(result.slots).toHaveLength(1);
    });
  });
});
