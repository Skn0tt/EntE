import { IUserCreate } from '../../../../../interfaces/index';
import { parse as papaparse, ParseResult } from 'papaparse';

const parse = function(file: File) {
  return new Promise<ParseResult>((complete, error) => {
    papaparse(file, {
      complete,
      error,
      header: true,
      dynamicTyping: true,
    });
  });
};

const isBlank = (str: string) => !str || /^\s*$/.test(str);

const parseCSV = async (input: File): Promise<IUserCreate[]> => {
  const parsed = await parse(input);

  const result: IUserCreate[] = parsed.data.map(row => ({
    password: isBlank(row.password) ? undefined : row.password,
    username: row.username,
    displayname: row.displayname,
    email: row.email,
    role: row.role,
    isAdult: row.isAdult,
    children: !!row.children ? row.children.split(';') : undefined,
  }));

  return result;
};

export default parseCSV;
