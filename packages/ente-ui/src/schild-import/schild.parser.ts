import * as Papa from "papaparse";
import { getYear, parseISO } from "date-fns";
import * as _ from "lodash";
import { CreateUserDto, Roles } from "ente-types";
import { validateCreateUserDtos } from "../helpers/parser";

const VORNAME = "Vorname";
const NACHNAME = "Nachname";
const ABSCHLUSS_DATUM = "vorauss. Abschlussdatum";
const ERZIEHER_1_VORNAME = "Erzieher 1: Vorname";
const ERZIEHER_1_NACHNAME = "Erzieher 1: Nachname";
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

const deriveDisplayname = (firstname: string, lastname: string) => {
  return `${firstname} ${lastname}`;
};

const parseDateToISO = (date: string) => {
  const isISO = /\d{4}-\d{2}-\d{2}/.test(date);
  if (isISO) {
    return date;
  }

  const [day, month, year] = date.split(".");

  return `${year}-${month}-${day}`;
};

const parseGradYear = (gradDate: string): number => {
  return getYear(parseISO(gradDate));
};

const renameDuplicateUsernames = <T extends CreateUserDto>(users: T[]): T[] => {
  return users.reduce<{ alreadySeen: string[]; result: T[] }>(
    (acc, user) => {
      const { alreadySeen, result } = acc;
      const { username } = user;

      const sightings = alreadySeen.filter(v => v === username).length;

      if (sightings === 0) {
        return {
          alreadySeen: [...alreadySeen, username],
          result: [...result, user]
        };
      }

      const newUsername = username + "." + sightings;
      const newUser = {
        ...user,
        username: newUsername
      };

      return {
        alreadySeen: [...alreadySeen, username],
        result: [...result, newUser]
      };
    },
    { alreadySeen: [], result: [] }
  ).result;
};

const parseInput = (input: any[]) => {
  const inputRows = input.map(v => ({
    firstName: v[VORNAME],
    lastName: v[NACHNAME],
    gradDate: v[ABSCHLUSS_DATUM],
    email: v[EMAIL_PRIVAT],
    birthday: v[GEBURTSDATUM],
    parent: {
      firstName: v[ERZIEHER_1_VORNAME],
      lastName: v[ERZIEHER_1_NACHNAME],
      email: v[ERZIEHER_EMAIL]
    }
  }));

  const users = _.flatMap<any, CreateUserDto & { parentEmail?: string }>(
    inputRows,
    v => [
      {
        username: deriveUsername(v.firstName, v.lastName),
        displayname: deriveDisplayname(v.firstName, v.lastName),
        birthday: parseDateToISO(v.birthday),
        graduationYear: parseGradYear(parseDateToISO(v.gradDate)),
        email: v.email,
        role: Roles.STUDENT,
        parentEmail: v.parent.email,
        children: []
      },
      {
        username: sanitizeName(v.parent.lastName),
        displayname: deriveDisplayname(v.parent.firstName, v.parent.lastName),
        email: v.parent.email,
        role: Roles.PARENT,
        graduationYear: undefined,
        birthday: undefined,
        children: []
      }
    ]
  );

  const uniqueUsers = _.uniqBy(users, u =>
    [u.username, u.displayname, u.email].join(";")
  );

  const uniqueUsersWithoutDuplicateNames = renameDuplicateUsernames(
    uniqueUsers
  );

  const [parents, students] = _.partition(
    uniqueUsersWithoutDuplicateNames,
    user => user.role === Roles.PARENT
  );

  const parentsWithChildrenUsernames = parents.map(p => ({
    ...p,
    children: students
      .filter(s => s.parentEmail === p.email)
      .map(s => s.username)
  }));

  const studentsWithoutParentEmail: CreateUserDto[] = students.map(s =>
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
  parseWithValidation
};
