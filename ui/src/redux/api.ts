import {
  Entry,
  User,
  IEntryAPI,
  IUserAPI,
  MongoId,
  createEntry,
  createUser,
  ICredentials,
  AuthState,
  Roles,
  ISlotAPI,
  createSlot,
  Slot
} from '../interfaces/index';
import axios, { AxiosRequestConfig } from 'axios';

const baseUrl = window ? `${location.protocol}//${location.hostname}:4000` : '';

export const checkAuth = async (auth: ICredentials): Promise<AuthState> => {
  const url = `${baseUrl}/login`;

  const config: AxiosRequestConfig = {
    auth,
    validateStatus: status => (status === 401) || (status === 200)
  };

  const response = await axios.get(url, config);

  if (response.status === 401) {
    return new AuthState({
      checked: true,
    });
  }
  
  const role: Roles = response.data.role;
  const children = response.data.children.map((child: IUserAPI) => createUser(child));
  
  return new AuthState({
    ...auth,
    role,
    children,
    checked: true,
  });
};

export const getEntry = async (id: MongoId, auth: ICredentials): Promise<Entry> => {
  const url = `${baseUrl}/entries/${id}`;

  const config: AxiosRequestConfig = { auth };

  const response = await axios.get(url, config);

  const data: IEntryAPI = response.data;
  const entry: Entry = createEntry(data);

  return entry;
};

export const getEntries = async (auth: ICredentials): Promise<Entry[]> => {
  const url = `${baseUrl}/entries`;
  const config: AxiosRequestConfig = { auth };

  const response = await axios.get(url, config);

  const data: IEntryAPI[] = response.data;
  const entries: Entry[] = data.map(item => createEntry(item));

  return entries;
};

export const getSlots = async (auth: ICredentials): Promise<Slot[]> => {
  const url = `${baseUrl}/slots`;
  const config: AxiosRequestConfig = { auth };

  const response = await axios.get(url, config);

  const data: ISlotAPI[] = response.data;
  const slots: Slot[] = data.map(item => createSlot(item));

  return slots;
};

export const getUser = async (id: MongoId, auth: ICredentials): Promise<User> => {
  const url = `${baseUrl}/users/${id}`;

  const config: AxiosRequestConfig = { auth };

  const response = await axios.get(url, config);

  const data: IUserAPI = response.data;
  const user: User = createUser(data);

  return user;
};

export const getUsers = async (auth: ICredentials): Promise<User[]> => {
  const url = `${baseUrl}/users`;

  const config: AxiosRequestConfig = {
    auth,
  };

  const response = await axios.get(url, config);

  const data: IUserAPI[] = response.data;
  const users: User[] = data.map(user => createUser(user));

  return users;
};

export const getTeachers = async (auth: ICredentials): Promise<User[]> => {
  const url = `${baseUrl}/users?role=teacher`;

  const config: AxiosRequestConfig = { auth };

  const response = await axios.get(url, config);

  const data: IUserAPI[] = response.data;
  const teachers: User[] = data.map(user => createUser(user));

  return teachers;
};
