import { makeTranslationHook } from "./helpers/makeTranslationHook";
import { Roles } from "@@types";

export const RoleTranslation = {
  en: {
    [Roles.MANAGER]: "Manager",
    [Roles.PARENT]: "Parent",
    [Roles.STUDENT]: "Student",
    [Roles.TEACHER]: "Teacher",
  },
  de: {
    [Roles.MANAGER]: "Stufenleitung",
    [Roles.PARENT]: "Erziehungsberechtigte*r",
    [Roles.STUDENT]: "Schüler*in",
    [Roles.TEACHER]: "Lehrkraft",
  },
};

export const useRoleTranslation = makeTranslationHook(RoleTranslation);
