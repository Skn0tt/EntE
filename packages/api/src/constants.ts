import { ObjectId } from 'bson';

export enum ROLES {
  PARENT = 'parent',
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  MANAGER = 'manager',
}
export const roles = [ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER, ROLES.PARENT, ROLES.MANAGER];
export type MongoId = ObjectId;
