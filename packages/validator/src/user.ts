import { IUserCreate, rolesArr } from "ente-types";
import { SyncValidator } from "./";
import * as _ from "lodash";

export const isValidUsername: SyncValidator<string> = v => true;
export const isValidIsAdult: SyncValidator<boolean> = v => _.isBoolean(v);
export const isValidDisplayname: SyncValidator<string> = name => true;
export const isValidRole: SyncValidator<string> = role =>
  rolesArr.indexOf(role) !== -1;
export const isValidEmail: SyncValidator<string> = email => true;

export const isValidUser: SyncValidator<IUserCreate> = user => {
  try {
    return true;
  } catch (_) {
    return false;
  }
};
