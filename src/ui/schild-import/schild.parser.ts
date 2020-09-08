import * as Papa from "papaparse";
import { getYear, parseISO } from "date-fns";
import * as _ from "lodash";
import { CreateUserDto, Roles } from "@@types";
import { validateCreateUserDtos } from "../helpers/parser";

const VORNAME = "Vorname";
const NACHNAME = "Nachname";
const ABSCHLUSS_DATUM = "vorauss. Abschlussdatum";
const ERZIEHER_1_VORNAME = "Erzieher 1: Vorname";
const ERZIEHER_1_NACHNAME = "Erzieher 1: Nachname";
const ERZIEHER_2_VORNAME = "Erzieher 2: Vorname";
const ERZIEHER_2_NACHNAME = "Erzieher 2: Nachname";
const ERZIEHER_1_EMAIL = "Erzieher 1: E-Mail";
const ERZIEHER_2_EMAIL = "Erzieher 2: E-Mail";
const ERZIEHER_EMAIL = "Erzieher: E-Mail";
const EMAIL_PRIVAT = "E-Mail (privat)";
const GEBURTSDATUM = "Geburtsdatum";

const replaceAll = (input: string, replace: string, by: string) =>
  input.split(replace).join(by);

export const sanitizeName = (username: string) =>
  replaceAll(username.toLowerCase(), " ", "_");

export const deriveUsername = (firstname: string, lastname: string) => {
  const username = `${firstname}.${lastname}`;
  return sanitizeName(username);
};

const parseDateToISO = (date: string) => {
  const isISO = /\d{4}-\d{2}-\d{2}/.test(date);
  if (isISO) {
    return date;
  }

  const [day, month, year] = date.split(".");

  return `${year}-${month}-${day}`;
};

const parseYear = (date: string): number => {
  return getYear(parseISO(date));
};

const renameDuplicateUsernames = <T extends CreateUserDto>(users: T[]): T[] => {
  return users.reduce<{ alreadySeen: string[]; result: T[] }>(
    (acc, user) => {
      const { alreadySeen, result } = acc;
      const { username } = user;

      const sightings = alreadySeen.filter((v) => v === username).length;

      if (sightings === 0) {
        return {
          alreadySeen: [...alreadySeen, username],
          result: [...result, user],
        };
      }

      const newUsername = username + "." + sightings;
      const newUser = {
        ...user,
        username: newUsername,
      };

      return {
        alreadySeen: [...alreadySeen, username],
        result: [...result, newUser],
      };
    },
    { alreadySeen: [], result: [] }
  ).result;
};

const parseInput = (input: any[]) => {
  const inputRows = input.map((v) => ({
    firstName: v[VORNAME],
    lastName: v[NACHNAME],
    gradDate: v[ABSCHLUSS_DATUM],
    email: v[EMAIL_PRIVAT],
    birthday: v[GEBURTSDATUM],
    parent1: {
      firstName: v[ERZIEHER_1_VORNAME],
      lastName: v[ERZIEHER_1_NACHNAME],
      email: v[ERZIEHER_1_EMAIL],
    },
    parent2: {
      firstName: v[ERZIEHER_2_VORNAME],
      lastName: v[ERZIEHER_2_NACHNAME],
      email: v[ERZIEHER_2_EMAIL],
    },
    parentEmail: v[ERZIEHER_EMAIL],
  }));

  const users = _.flatMap<
    typeof inputRows[0],
    CreateUserDto & { parentEmail?: string[] }
  >(inputRows, (v: typeof inputRows[0]) => {
    const child = {
      username: deriveUsername(v.firstName, v.lastName),
      firstName: v.firstName,
      lastName: v.lastName,
      birthday: parseDateToISO(v.birthday),
      class: "" + parseYear(parseDateToISO(v.gradDate)),
      email: v.email,
      role: Roles.STUDENT,
      parentEmail: [] as string[],
      isAdmin: false,
      children: [],
    };

    const result: (CreateUserDto & { parentEmail?: string[] })[] = [child];

    if (v.parent1.email) {
      child.parentEmail.push(v.parent1.email);
      result.push({
        username: deriveUsername(v.parent1.firstName, v.parent1.lastName),
        firstName: v.parent1.firstName,
        lastName: v.parent1.lastName,
        email: v.parent1.email,
        role: Roles.PARENT,
        class: undefined,
        birthday: undefined,
        isAdmin: false,
        children: [],
      });
    }

    if (v.parent2.email) {
      child.parentEmail.push(v.parent2.email);
      result.push({
        username: deriveUsername(v.parent2.firstName, v.parent2.lastName),
        firstName: v.parent2.firstName,
        lastName: v.parent2.lastName,
        email: v.parent2.email,
        role: Roles.PARENT,
        class: undefined,
        birthday: undefined,
        isAdmin: false,
        children: [],
      });
    }

    if (child.parentEmail.length === 0 && v.parentEmail) {
      child.parentEmail.push(v.parentEmail);
      result.push({
        username: deriveUsername(v.parent1.firstName, v.parent1.lastName),
        firstName: v.parent1.firstName,
        lastName: v.parent1.lastName,
        email: v.parentEmail,
        role: Roles.PARENT,
        class: undefined,
        birthday: undefined,
        isAdmin: false,
        children: [],
      });
    }

    return result;
  });

  const uniqueUsers = _.uniqBy(users, (u) =>
    [u.username, u.firstName, u.lastName, u.email].join(";")
  );

  const uniqueUsersWithoutDuplicateNames = renameDuplicateUsernames(
    uniqueUsers
  );

  const [parents, students] = _.partition(
    uniqueUsersWithoutDuplicateNames,
    (user) => user.role === Roles.PARENT
  );

  const parentsWithChildrenUsernames = parents.map((p) => ({
    ...p,
    children: students
      .filter((s) => s.parentEmail!.includes(p.email))
      .map((s) => s.username),
  }));

  const studentsWithoutParentEmail: CreateUserDto[] = students.map((s) =>
    _.omit(s, "parentEmail")
  );

  return [...parentsWithChildrenUsernames, ...studentsWithoutParentEmail];
};

export const parse = (input: string) => {
  const trimmedInput = input.trim();
  const result = Papa.parse(trimmedInput, { header: true });
  const users = parseInput(result.data);
  return users;
};

export const parseWithValidation = (
  input: string,
  existingStudentUsernames: string[]
) => {
  const rows = parse(input);
  return validateCreateUserDtos(rows, existingStudentUsernames);
};

export const SchildParser = {
  parseWithValidation,
};
