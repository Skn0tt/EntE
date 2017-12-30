import {
  Entry,
  User,
  MongoId,
  ICredentials,
  AuthState,
  Roles,
  Slot,
  APIResponse,
  IAPIResponse
} from '../interfaces/index';
import axios, { AxiosRequestConfig } from 'axios';

const baseUrl = window ? `${location.protocol}//${location.hostname}:4000` : '';

export const get = async (url: string, auth: ICredentials) => {
  const response = await axios.get(url, { auth });
  return response.data;
};

export const transform = (data: IAPIResponse): APIResponse => ({
  entries: data.entries.map(entry => new Entry(entry)),
  slots: data.slots.map(slot => new Slot(slot)),
  users: data.users.map(user => new User(user)),
});

export const transformAuth = (data: IAPIResponse, password: string): APIResponse => ({
  auth: new AuthState({
    password,
    checked: true,
    ...data.auth,
  }),
  ...transform(data),
});

export const checkAuth = async (auth: ICredentials): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/login`, auth);
  return transformAuth(data, auth.password);
};

export const getEntry = async (id: MongoId, auth: ICredentials): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/entries/${id}`, auth);
  return transform(data);
};

export const getEntries = async (auth: ICredentials): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/entries`, auth);
  return transform(data);
};

export const getSlots = async (auth: ICredentials): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/slots`, auth);
  return transform(data);
};

export const getUser = async (id: MongoId, auth: ICredentials): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/users/${id}`, auth);
  return transform(data);
};

export const getUsers = async (auth: ICredentials): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/users`, auth);
  return transform(data);
};

export const getTeachers = async (auth: ICredentials): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/users?role=teacher`, auth);
  return transform(data);
};
