import { ICredentials, IAPIResponse } from "../../types/index";
import { ParseUsersResult } from "../parseCSV/index";
import parseCSV from '../parseCSV';
import parseXLSX from '../parseXLSX';
import axios from 'axios';

const importUsersFromXLSX = async (input: string, baseUrl, string, credentials: ICredentials): Promise<IAPIResponse> => {
  const users = await parseXLSX(input);
  return await importUsers(users, baseUrl, credentials);
}

const importUsersFromCSV = async (input: string, baseUrl: string, credentials: ICredentials): Promise<IAPIResponse> => {
  const users = await parseCSV(input);
  return await importUsers(users, baseUrl, credentials);
}

const importUsers = async (input: ParseUsersResult, baseUrl: string, auth: ICredentials): Promise<IAPIResponse> => {
  const url = `${baseUrl}/api/users`;

  const result: IAPIResponse = {
    entries: [],
    slots: [],
    users: [],
  };

  if (input.students.length > 0) {
    const response = await axios.post<IAPIResponse>(url, input.students, { auth });
    result.entries!.push(...response.data.entries!);
    result.slots!.push(...response.data.slots!);
    result.users!.push(...response.data.users!);
  }

  const otherUsers = input.admins.concat(input.managers, input.parents, input.teachers);
  const response = await axios.post<IAPIResponse>(url, otherUsers, { auth });
  const { data } = response;
  result.entries!.push(...response.data.entries!);
  result.slots!.push(...response.data.slots!);
  result.users!.push(...response.data.users!);

  return result;
}

export default importUsers;
