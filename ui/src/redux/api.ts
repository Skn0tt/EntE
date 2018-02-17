import {
  Entry,
  User,
  MongoId,
  ICredentials,
  AuthState,
  Slot,
  APIResponse,
  IAPIResponse,
  IEntryCreate,
  IUserCreate,
  IUser,
} from '../interfaces/index';
import axios from 'axios';

const baseUrl = window && `${location.protocol}//${location.hostname}/api`;

const defaultResponse: APIResponse = {
  entries: [],
  slots: [],
  users: [],
};

const reviver = (key: string, value: any) =>
  ['date', 'dateEnd', 'createdAt', 'updatedAt'].indexOf(key) !== -1 ? new Date(value) : value;

const transformDates = (data: string) => {
  const input = JSON.parse(data, reviver);
  return input;
};

const get = async (url: string, auth: ICredentials) => {
  const response = await axios.get(url, { auth, transformResponse: transformDates });
  return response.data;
};

const transform = (data: IAPIResponse): APIResponse => ({
  entries: data.entries ? data.entries.map(entry => new Entry(entry)) : [],
  slots: data.slots ? data.slots.map(slot => new Slot(slot)) : [],
  users: data.users ? data.users.map(user => new User(user)) : [],
});

const transformAuth = (data: IAPIResponse, auth: ICredentials) => ({
  auth: new AuthState({
    ...auth,
    ...data.auth,
  }),
  ...transform(data),
});

export const checkAuth = async (auth: ICredentials): Promise<APIResponse> => {
  if (auth.username !== '' && auth.password !== '') {
    const response = await axios.get(`${baseUrl}/login`, {
      auth,
      validateStatus: status => status === 401 || status === 200,
      transformResponse: transformDates,
    });

    if (response.status === 200) return transformAuth(response.data, auth);
  }

  return {
    auth: new AuthState({}),
    ...defaultResponse,
  };
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

const post = async (url: string, auth: ICredentials, body?: {}) => {
  const response = await axios.post(url, body, { auth, transformResponse: transformDates });
  return response.data;
};

export const createEntry = async (
  entry: IEntryCreate,
  auth: ICredentials,
): Promise<APIResponse> => {
  const response = await post(`${baseUrl}/entries/`, auth, entry);
  return transform(response);
};

export const createUser = async (user: IUserCreate[], auth: ICredentials): Promise<APIResponse> => {
  const response = await post(`${baseUrl}/users/`, auth, user);
  return transform(response);
};

const patch = async (url: string, auth: ICredentials, body?: {}) => {
  const response = await axios.patch(url, body, { auth, transformResponse: transformDates });
  return response.data;
};

export const updateUser = async (
  user: Partial<IUser>,
  auth: ICredentials,
): Promise<APIResponse> => {
  const response = await patch(`${baseUrl}/users/${user._id}`, auth, user);
  return transform(response);
};

const put = async (url: string, auth: ICredentials, body?: {}) => {
  const response = await axios.put(url, body, { auth, transformResponse: transformDates });
  return response.data;
};

export const signEntry = async (id: MongoId, auth: ICredentials): Promise<APIResponse> => {
  const response = await put(`${baseUrl}/entries/${id}/sign`, auth);
  return transform(response);
};

export const resetPassword = async (username: MongoId): Promise<string> => {
  const result = await axios.post(`${baseUrl}/auth/forgot/${username}`);
  return result.data;
};

export const setPassword = async (token: string, newPassword: string) => {
  const result = await axios.put(`${baseUrl}/auth/forgot/${token}`, { newPassword });
  return result.data;
};
