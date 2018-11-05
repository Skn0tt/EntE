/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import axios, { AxiosRequestConfig } from "axios";

import { config } from "./";
import {
  APIResponse,
  UserN,
  EntryN,
  SlotN,
  AuthState,
  BasicCredentials
} from "./types";
import {
  CreateEntryDto,
  CreateUserDto,
  PatchUserDto,
  UserDto,
  EntryDto,
  SlotDto,
  JwtTokenPayload,
  PatchEntryDto
} from "ente-types";

import * as _ from "lodash";

const axiosStandardParams = (token: string): AxiosRequestConfig => ({
  ...axiosTokenParams(token),
  transformResponse: transformDates,
  validateStatus: s => s >= 200 && s < 300
});

const axiosTokenParams = (token: string): AxiosRequestConfig => ({
  headers: {
    Authorization: "Bearer " + token
  }
});

const reviver = (key: string, value: any) =>
  ["date", "dateEnd", "createdAt", "updatedAt"].indexOf(key) !== -1
    ? new Date(value)
    : value;

const transformDates = (data: string) => {
  const input = JSON.parse(data, reviver);
  return input;
};

const get = async <T>(url: string, token: string) => {
  const response = await axios.get<T>(url, axiosStandardParams(token));
  return response.data;
};

const mergeAPIResponses = (...values: APIResponse[]): APIResponse => {
  const entries = _.concat([], ...values.map(v => v.entries));
  const users = _.concat([], ...values.map(v => v.users));
  const slots = _.concat([], ...values.map(v => v.slots));

  return {
    entries: _.uniqBy(entries, e => e.get("id")),
    slots: _.uniqBy(slots, e => e.get("id")),
    users: _.uniqBy(users, e => e.get("id"))
  };
};

const emptyAPIResponse = (): APIResponse => ({
  entries: [],
  slots: [],
  users: []
});

export const transformUsers = (...users: UserDto[]): APIResponse => {
  let result = emptyAPIResponse();

  users.forEach(user => {
    const { children } = user;
    const childrenIds = children.map(c => c.id);

    const normalised = new UserN({
      ...user,
      children: [],
      childrenIds
    });
    result.users.push(normalised);

    const childrenResponse = transformUsers(...children);
    result = mergeAPIResponses(result, childrenResponse);
  });

  return result;
};

export const transformEntries = (...entries: EntryDto[]): APIResponse => {
  let result = emptyAPIResponse();

  entries.forEach(entry => {
    const { student, slots } = entry;
    const normalised = new EntryN({
      ...entry,
      student: null,
      slots: [],
      studentId: student.id,
      slotIds: slots.map(s => s.id)
    });

    result.entries.push(normalised);

    const slotResponse = transformSlots(...slots);
    const studentResponse = transformUsers(student);

    result = mergeAPIResponses(result, slotResponse, studentResponse);
  });

  return result;
};

export const transformSlots = (...slots: SlotDto[]): APIResponse => {
  let result = emptyAPIResponse();

  slots.forEach(slot => {
    const { student, teacher } = slot;
    const normalised = new SlotN({
      ...slot,
      student: null,
      teacher: null,
      studentId: student.id,
      teacherId: teacher.id
    });

    result.slots.push(normalised);

    const userResponse = transformUsers(student, teacher);
    result = mergeAPIResponses(result, userResponse);
  });

  return result;
};

const fromBase64 = (b64: string) =>
  Buffer.from(b64, "base64").toString("ascii");

export const getTokenPayload = (token: string): JwtTokenPayload => {
  const payload = JSON.parse(fromBase64(token.split(".")[1]));

  return payload;
};

const getAuthState = (token: string, payload: JwtTokenPayload): AuthState => {
  return new AuthState({
    role: payload.role,
    displayname: payload.displayname,
    username: payload.username,
    token,
    children: payload.childrenIds,
    exp: new Date((payload as any).exp * 1000)
  });
};

export const getToken = async (auth: BasicCredentials): Promise<AuthState> => {
  const response = await axios.get<string>(`${config.baseUrl}/token`, {
    auth
  });

  const tokenPayload = getTokenPayload(response.data);

  return getAuthState(response.data, tokenPayload);
};

export const refreshToken = async (token: string): Promise<AuthState> => {
  try {
    const result = await axios.get<string>(
      `${config.baseUrl}/token`,
      axiosTokenParams(token)
    );

    const tokenPayload = getTokenPayload(result.data);

    return getAuthState(result.data, tokenPayload);
  } catch (error) {
    throw error;
  }
};

export const getChildren = async (token: string): Promise<APIResponse> => {
  const data = await get<UserDto[]>(
    `${config.baseUrl}/users?filter=children`,
    token
  );
  return transformUsers(...data);
};

export const getNeededUsers = async (token: string): Promise<APIResponse> => {
  const data = await get<UserDto[]>(`${config.baseUrl}/users`, token);
  return transformUsers(...data);
};

export const downloadExcelExport = async (token: string): Promise<void> => {
  const response = await axios.get<Blob>(`${config.baseUrl}/export/excel`, {
    ...axiosTokenParams(token),
    responseType: "blob"
  });
  config.onFileDownload(response.data, "export.xlsx");
};

export const getEntry = async (
  id: string,
  token: string
): Promise<APIResponse> => {
  const data = await get<EntryDto>(`${config.baseUrl}/entries/${id}`, token);
  return transformEntries(data);
};

export const getEntries = async (token: string): Promise<APIResponse> => {
  const data = await get<EntryDto[]>(`${config.baseUrl}/entries`, token);
  return transformEntries(...data);
};

export const getSlots = async (token: string): Promise<APIResponse> => {
  const data = await get<SlotDto[]>(`${config.baseUrl}/slots`, token);
  return transformSlots(...data);
};

export const getUser = async (
  id: string,
  token: string
): Promise<APIResponse> => {
  const data = await get<UserDto>(`${config.baseUrl}/users/${id}`, token);
  return transformUsers(data);
};

const _delete = async <T>(url: string, token: string) => {
  const response = await axios.delete(url, axiosTokenParams(token));
  return response.data as T;
};

export const deleteUser = async (id: string, token: string) => {
  await _delete(`${config.baseUrl}/users/${id}`, token);
};

export const deleteEntry = async (id: string, token: string) => {
  await _delete(`${config.baseUrl}/entries/${id}`, token);
};

export const getUsers = async (token: string): Promise<APIResponse> => {
  const data = await get<UserDto[]>(`${config.baseUrl}/users`, token);
  return transformUsers(...data);
};

const post = async <T>(url: string, token: string, body?: {}) => {
  const response = await axios.post<T>(url, body, axiosStandardParams(token));
  return response.data;
};

export const createEntry = async (
  entry: CreateEntryDto,
  token: string
): Promise<APIResponse> => {
  const response = await post<EntryDto>(
    `${config.baseUrl}/entries/`,
    token,
    entry
  );
  return transformEntries(response);
};

export const createUsers = async (
  users: CreateUserDto[],
  token: string
): Promise<APIResponse> => {
  const response = await post<UserDto[]>(
    `${config.baseUrl}/users/`,
    token,
    users
  );
  return transformUsers(...response);
};

const patch = async <T, B = {}>(url: string, token: string, body?: B) => {
  const response = await axios.patch<T>(url, body, axiosStandardParams(token));
  return response.data;
};

export const updateUser = async (
  userId: string,
  user: PatchUserDto,
  token: string
): Promise<APIResponse> => {
  const response = await patch<UserDto>(
    `${config.baseUrl}/users/${userId}`,
    token,
    user
  );
  return transformUsers(response);
};

const put = async <T, B = {}>(url: string, token: string, body?: B) => {
  const response = await axios.put<T>(url, body, axiosStandardParams(token));
  return response.data;
};

export const signEntry = async (
  id: string,
  token: string
): Promise<APIResponse> => {
  const response = await patch<EntryDto, PatchEntryDto>(
    `${config.baseUrl}/entries/${id}`,
    token,
    {
      signed: true
    }
  );
  return transformEntries(response);
};

export const unsignEntry = async (
  id: string,
  token: string
): Promise<APIResponse> => {
  const response = await patch<EntryDto, PatchEntryDto>(
    `${config.baseUrl}/entries/${id}`,
    token,
    {
      signed: false
    }
  );
  return transformEntries(response);
};

export const patchForSchool = async (
  id: string,
  forSchool: boolean,
  token: string
): Promise<APIResponse> => {
  const response = await patch<EntryDto, PatchEntryDto>(
    `${config.baseUrl}/entries/${id}`,
    token,
    {
      forSchool
    }
  );
  return transformEntries(response);
};

export const resetPassword = async (username: string): Promise<string> => {
  const result = await axios.post(
    `${config.baseUrl}/passwordReset/${username}`
  );
  return result.data;
};

export const setPassword = async (token: string, newPassword: string) => {
  const result = await axios.put(
    `${config.baseUrl}/passwordReset/${token}`,
    newPassword,
    {
      headers: {
        "Content-Type": "text/plain"
      }
    }
  );
  return result.data;
};
