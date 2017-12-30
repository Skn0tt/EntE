import { ObjectId } from 'bson';

export enum ROLES {
  PARENT = 'parent',
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}
export const roles = [ROLES.ADMIN, ROLES.STUDENT, ROLES.TEACHER, ROLES.PARENT];
export type MongoId = ObjectId;
