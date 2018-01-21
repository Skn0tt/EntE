import { IUserCreate, Roles } from '../interfaces/index';
import { ParseConfig, parse } from 'papaparse';

export interface ParseUsersResult {
  students: IUserCreate[];
  parents: IUserCreate[];
  teachers: IUserCreate[];
  managers: IUserCreate[];
  admins: IUserCreate[];
}

const config: ParseConfig = {
  header: true,
  dynamicTyping: true,
};

const parseCSV = (input: string): ParseUsersResult => {
  const parsed = parse(input, config);
  
  const data: IUserCreate[] = parsed.data;

  const result: ParseUsersResult = {
    students: [],
    parents: [],
    teachers: [],
    managers: [],
    admins: [],
  };

  data.forEach((item) => {
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
  });

  return result;
};

export default parseCSV;
