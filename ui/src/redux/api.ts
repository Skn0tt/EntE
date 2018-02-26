import {
  Entry,
  User,
  MongoId,
  Slot,
  APIResponse,
  IAPIResponse,
  IEntryCreate,
  IUserCreate,
  IUser,
  ICredentials,
  TokenInfo,
} from '../interfaces/index';
import axios from 'axios';

const baseUrl = window && `${location.protocol}//${location.hostname}/api`;

const reviver = (key: string, value: any) =>
  ['date', 'dateEnd', 'createdAt', 'updatedAt'].indexOf(key) !== -1 ? new Date(value) : value;

const transformDates = (data: string) => {
  const input = JSON.parse(data, reviver);
  return input;
};

const get = async (url: string, token: string) => {
  const response = await axios.get(url, {
    transformResponse: transformDates,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  return response.data;
};

const transform = (data: IAPIResponse): APIResponse => ({
  entries: data.entries ? data.entries.map(entry => new Entry(entry)) : [],
  slots: data.slots ? data.slots.map(slot => new Slot(slot)) : [],
  users: data.users ? data.users.map(user => new User(user)) : [],
});

export const getTokenInfo = (token: string): TokenInfo => {
  const payload = JSON.parse(atob(token.split('.')[1]));

  return ({
    token,
    exp: new Date(payload.exp),
    displayname: payload.displayname,
    role: payload.role,
    children: payload.children,
  });
}

export const getToken = async (auth: ICredentials): Promise<TokenInfo> => {
  const response = await axios.get(`${baseUrl}/token`, {
    auth,
  });

  return getTokenInfo(response.data);
}

export const refreshToken = async (token: string): Promise<TokenInfo> => {
  try {
    const result = await get(`${baseUrl}/token`, token);

    return getTokenInfo(result);
  } catch (error) {
    throw error;
  }
}

export const getEntry = async (id: MongoId, token: string): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/entries/${id}`, token);
  return transform(data);
};

export const getEntries = async (token: string): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/entries`, token);
  return transform(data);
};

export const getSlots = async (token: string): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/slots`, token);
  return transform(data);
};

export const getUser = async (id: MongoId, token: string): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/users/${id}`, token);
  return transform(data);
};

export const getUsers = async (token: string): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/users`, token);
  return transform(data);
};

export const getTeachers = async (token: string): Promise<APIResponse> => {
  const data = await get(`${baseUrl}/users?role=teacher`, token);
  return transform(data);
};

const post = async (url: string, token: string, body?: {}) => {
  const response = await axios.post(url, body, {
    transformResponse: transformDates,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  return response.data;
};

export const createEntry = async (
  entry: IEntryCreate,
  token: string,
): Promise<APIResponse> => {
  const response = await post(`${baseUrl}/entries/`, token, entry);
  return transform(response);
};

export const createUser = async (user: IUserCreate[], token: string): Promise<APIResponse> => {
  const response = await post(`${baseUrl}/users/`, token, user);
  return transform(response);
};

const patch = async (url: string, token: string, body?: {}) => {
  const response = await axios.patch(url, body, {
    transformResponse: transformDates,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  return response.data;
};

export const updateUser = async (
  user: Partial<IUser>,
  token: string,
): Promise<APIResponse> => {
  const response = await patch(`${baseUrl}/users/${user._id}`, token, user);
  return transform(response);
};

const put = async (url: string, token: string, body?: {}) => {
  const response = await axios.put(url, body, {
    transformResponse: transformDates,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });
  return response.data;
};

export const signEntry = async (id: MongoId, token: string): Promise<APIResponse> => {
  const response = await put(`${baseUrl}/entries/${id}/sign`, token);
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
