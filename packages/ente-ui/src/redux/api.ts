/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import axios, { AxiosRequestConfig } from "axios";

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
  PatchEntryDto,
  Languages
} from "ente-types";
import * as _ from "lodash";
import { Base64 } from "../helpers/base64";
import { getConfig } from "./config";

const getBaseUrl = () => getConfig().baseUrl;

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

export const mergeAPIResponses = (...values: APIResponse[]): APIResponse => {
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
      childrenIds,
      ...user,
      children: []
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
      student: (null as unknown) as UserDto,
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
      student: (null as unknown) as UserDto,
      teacher: (null as unknown) as UserDto,
      studentId: student.id,
      teacherId: !!teacher ? teacher.id : null
    });

    result.slots.push(normalised);

    const userResponse =
      teacher === null
        ? transformUsers(student)
        : transformUsers(student, teacher);
    result = mergeAPIResponses(result, userResponse);
  });

  return result;
};

export const getTokenPayload = (token: string): JwtTokenPayload => {
  const [header, payload, signature] = token.split(".");
  const decodedPayload = JSON.parse(Base64.decode(payload));

  return decodedPayload;
};

const getAuthState = (token: string, payload: JwtTokenPayload): AuthState => {
  return new AuthState({
    token,
    role: payload.role,
    displayname: payload.displayname,
    username: payload.username,
    children: payload.childrenIds,
    userId: payload.id,
    exp: new Date((payload as any).exp * 1000)
  });
};

export const getToken = async (auth: BasicCredentials): Promise<AuthState> => {
  const response = await axios.get<string>(`${getBaseUrl()}/token`, {
    auth
  });

  const tokenPayload = getTokenPayload(response.data);

  return getAuthState(response.data, tokenPayload);
};

export const refreshToken = async (token: string): Promise<AuthState> => {
  try {
    const result = await axios.get<string>(
      `${getBaseUrl()}/token`,
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
    `${getBaseUrl()}/users?filter=children`,
    token
  );
  return transformUsers(...data);
};

export const getNeededUsers = async (token: string): Promise<APIResponse> => {
  const data = await get<UserDto[]>(`${getBaseUrl()}/users`, token);
  return transformUsers(...data);
};

export const downloadExcelExport = async (token: string): Promise<void> => {
  const response = await axios.get<Blob>(`${getBaseUrl()}/export/excel`, {
    ...axiosTokenParams(token),
    responseType: "blob"
  });
  getConfig().onFileDownload(response.data, "export.xlsx");
};

export const getEntry = async (
  id: string,
  token: string
): Promise<APIResponse> => {
  const data = await get<EntryDto>(`${getBaseUrl()}/entries/${id}`, token);
  return transformEntries(data);
};

export const getEntries = async (token: string): Promise<APIResponse> => {
  const data = await get<EntryDto[]>(`${getBaseUrl()}/entries`, token);
  return transformEntries(...data);
};

export const getSlots = async (token: string): Promise<APIResponse> => {
  const data = await get<SlotDto[]>(`${getBaseUrl()}/slots`, token);
  return transformSlots(...data);
};

export const getUser = async (
  id: string,
  token: string
): Promise<APIResponse> => {
  const data = await get<UserDto>(`${getBaseUrl()}/users/${id}`, token);
  return transformUsers(data);
};

const _delete = async <T>(url: string, token: string) => {
  const response = await axios.delete(url, axiosTokenParams(token));
  return response.data as T;
};

export const deleteUser = async (id: string, token: string) => {
  await _delete(`${getBaseUrl()}/users/${id}`, token);
};

export const deleteEntry = async (id: string, token: string) => {
  await _delete(`${getBaseUrl()}/entries/${id}`, token);
};

export const getUsers = async (token: string): Promise<APIResponse> => {
  const data = await get<UserDto[]>(`${getBaseUrl()}/users`, token);
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
    `${getBaseUrl()}/entries/`,
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
    `${getBaseUrl()}/users/`,
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
    `${getBaseUrl()}/users/${userId}`,
    token,
    user
  );
  return transformUsers(response);
};

const put = async <T, B = {}>(
  url: string,
  token: string,
  body?: B,
  config: AxiosRequestConfig = {}
) => {
  const response = await axios.put<T>(
    url,
    body,
    _.merge(axiosStandardParams(token), config)
  );
  return response.data;
};

export const signEntry = async (
  id: string,
  token: string
): Promise<APIResponse> => {
  const response = await patch<EntryDto, PatchEntryDto>(
    `${getBaseUrl()}/entries/${id}`,
    token,
    {
      signed: true
    }
  );
  return transformEntries(response);
};

export const setLanguage = async (
  id: string,
  language: Languages,
  token: string
): Promise<void> => {
  await put<void, Languages>(
    `${getBaseUrl()}/users/${id}/language`,
    token,
    language,
    {
      transformResponse: [],
      headers: {
        "Content-Type": "text/plain"
      }
    }
  );
};

export const unsignEntry = async (
  id: string,
  token: string
): Promise<APIResponse> => {
  const response = await patch<EntryDto, PatchEntryDto>(
    `${getBaseUrl()}/entries/${id}`,
    token,
    {
      signed: false
    }
  );
  return transformEntries(response);
};

export const resetPassword = async (username: string): Promise<string> => {
  const result = await axios.post(`${getBaseUrl()}/passwordReset/${username}`);
  return result.data;
};

export const setPassword = async (token: string, newPassword: string) => {
  const result = await axios.put(
    `${getBaseUrl()}/passwordReset/${token}`,
    newPassword,
    {
      headers: {
        "Content-Type": "text/plain"
      }
    }
  );
  return result.data;
};

export const importUsers = async (
  token: string,
  dtos: CreateUserDto[],
  {
    deleteEntries,
    deleteUsers
  }: { deleteUsers: boolean; deleteEntries: boolean }
) => {
  const result = await post<UserDto[]>(
    `${getBaseUrl()}/instance/import?deleteUsers=${deleteUsers}&deleteEntries=${deleteEntries}`,
    token,
    dtos
  );
  return transformUsers(...result);
};
