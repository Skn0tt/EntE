import {
  Entry,
  User,
  IEntryAPI,
  IUserAPI,
  MongoId,
  createEntry,
  createUser
} from '../interfaces/index';
import axios, { AxiosRequestConfig } from 'axios';

const baseUrl = window ? `${location.protocol}//${location.hostname}:4000` : '';

export const getEntry = async (id: MongoId): Promise<Entry> => {
  const url = `${baseUrl}/entries/${id}`;

  const config: AxiosRequestConfig = {
    auth: {
      username: 'admin',
      password: 'root',
    }
  };

  const response = await axios.get(url, config);

  const data: IEntryAPI = response.data;
  const entry: Entry = createEntry(data);

  return entry;
};

export const getEntries = async (): Promise<Entry[]> => {
  const url = `${baseUrl}/entries`;
  const config: AxiosRequestConfig = {
    auth: {
      username: 'admin',
      password: 'root',
    }
  };
  const response = await axios.get(url, config);

  const data: IEntryAPI[] = response.data;
  const entries: Entry[] = data.map(item => createEntry(item));

  return entries;
};

export const getUser = async (id: MongoId): Promise<User> => {
  const url = `${baseUrl}/users/${id}`;

  const config: AxiosRequestConfig = {
    auth: {
      username: 'admin',
      password: 'root',
    }
  };

  const response = await axios.get(url, config);

  const data: IUserAPI = response.data;
  const user: User = createUser(data);

  return user;
};

export const getUsers = async (): Promise<User[]> => {
  const url = `${baseUrl}/users`;

  const config: AxiosRequestConfig = {
    auth: {
      username: 'admin',
      password: 'root',
    }
  };

  const response = await axios.get(url, config);

  const data: IUserAPI[] = response.data;
  const users: User[] = data.map(user => createUser(user));

  return users;
};
