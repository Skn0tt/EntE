import { IUserBase, Roles, IUser } from "../../types/index";
import { parse, ParseConfig } from 'papaparse';
import validate from "./validate";

export interface ParseUsersResult {
  students: IUserBase[];
  parents: IUserBase[];
  teachers: IUserBase[];
  managers: IUserBase[];
  admins: IUserBase[];
};

const config: ParseConfig = {
  header: true,
  dynamicTyping: true
}

const parseCSV = (input: string): ParseUsersResult => {
  const parsed = parse(input, config);
  
  const data: {}[] = parsed.data;

  const result: ParseUsersResult = {
    students: [],
    parents: [],
    teachers: [],
    managers: [],
    admins: [],
  };

  data.forEach((item: IUserBase) => {
    switch (item.role) {
      case Roles.ADMIN:
        result.admins.push(item);
        break;
      case Roles.MANAGER:
        result.managers.push(item);
        break;
      case Roles.STUDENT:
        result.students.push(item);
        break;
      case Roles.TEACHER:
        result.teachers.push(item);
        break;
      case Roles.PARENT:
        result.parents.push(item);
        break;
    }
  })

  try {
    validate(result);
    return result;
  } catch (error) {
    throw error;
  }
}

export default parseCSV;
