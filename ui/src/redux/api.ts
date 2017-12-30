import {
  Entry,
  User,
  MongoId,
  ICredentials,
  AuthState,
  Slot,
  APIResponse,
  IAPIResponse
} from '../interfaces/index';
import axios from 'axios';

const baseUrl = window ? `${location.protocol}//${location.hostname}:4000` : '';

export const get = async (url: string, auth: ICredentials) => {
  const response = await axios.get(url, { auth });
  return response.data;
};

export const transform = (data: IAPIResponse): APIResponse => ({
  entries: data.entries ? data.entries.map(entry => new Entry(entry)) : [],
  slots: data.slots ? data.slots.map(slot => new Slot(slot)) : [],
  users: data.users ? data.users.map(user => new User(user)) : [],
});

export const checkAuth = async (auth: ICredentials): Promise<{ auth: AuthState, data: APIResponse }> => {
  const response = await axios.get(`${baseUrl}/login`, {
    auth,
    validateStatus: status =>
      (status === 401) ||
      (status === 200),
  });

  if (response.status === 401) {
    return ({
      auth: new AuthState({
        checked: true,
      }),
      data: {},
    });
  }
  const authState = new AuthState({
    checked: true,
    ...auth,
    ...response.data.auth,
  });
  return ({ auth: authState, data: transform(response.data) });
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
