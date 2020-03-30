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
  Languages,
  InstanceConfigDto,
  LoginDto,
  BlackedUserDto,
  BlackedEntryDto,
  BlackedSlotDto
} from "ente-types";
import * as _ from "lodash";
import { Base64 } from "../helpers/base64";
import { getConfig } from "./config";
import { Map, Set } from "immutable";

const getBaseUrl = () => getConfig().baseUrl;

const axiosStandardParams = (token: string): AxiosRequestConfig => ({
  ...axiosTokenParams(token),
  validateStatus: s => s >= 200 && s < 300
});

const axiosTokenParams = (token: string): AxiosRequestConfig => ({
  headers: {
    Authorization: "Bearer " + token
  }
});

const get = async <T>(url: string, token: string) => {
  const response = await axios.get<T>(url, axiosStandardParams(token));
  return response.data;
};

export const mergeAPIResponses = (...values: APIResponse[]): APIResponse => {
  return values.reduce((previousResponse, value) => {
    return {
      entries: previousResponse.entries.mergeDeep(value.entries),
      slots: previousResponse.slots.mergeDeep(value.slots),
      users: previousResponse.users.mergeDeep(value.users)
    };
  }, emptyAPIResponse());
};

const emptyAPIResponse = (): APIResponse => ({
  entries: Map(),
  slots: Map(),
  users: Map()
});

export const normalizeUsers = (...users: BlackedUserDto[]): APIResponse => {
  let result = emptyAPIResponse();

  users.forEach(user => {
    const { children = [] } = user;
    const childrenIds = children.map(c => c.id);

    const normalised = new UserN({
      childrenIds,
      ...user,
      children: []
    });
    result.users = result.users.mergeIn([normalised.get("id")], normalised);

    const childrenResponse = normalizeUsers(...children);
    result = mergeAPIResponses(result, childrenResponse);
  });

  return result;
};

export const normalizeEntries = (
  ...entries: BlackedEntryDto[]
): APIResponse => {
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

    result.entries = result.entries.mergeIn([normalised.get("id")], normalised);

    const slotResponse = normalizeSlots(...slots);
    const studentResponse = normalizeUsers(student);

    result = mergeAPIResponses(result, slotResponse, studentResponse);
  });

  return result;
};

export const normalizeSlots = (...slots: BlackedSlotDto[]): APIResponse => {
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

    result.slots = result.slots.mergeIn([normalised.get("id")], normalised);

    const userResponse =
      teacher === null
        ? normalizeUsers(student)
        : normalizeUsers(student, teacher);
    result = mergeAPIResponses(result, userResponse);
  });

  return result;
};

export const getTokenPayload = (token: string): JwtTokenPayload => {
  const [header, payload, signature] = token.split(".");
  const decodedPayload = JSON.parse(Base64.decode(payload));

  return decodedPayload;
};

const getAuthState = (token: string): AuthState => {
  const payload = getTokenPayload(token);
  return new AuthState({
    token,
    exp: new Date((payload as any).exp * 1000)
  });
};

export interface LoginInfo {
  authState: AuthState;
  apiResponse: APIResponse;
  oneSelf: UserN;
  reviewedRecords: Set<string>;
}

export const login = async (auth: BasicCredentials): Promise<LoginInfo> => {
  const response = await axios.get<LoginDto>(`${getBaseUrl()}/login`, {
    auth
  });

  const {
    token,
    oneSelf,
    neededUsers,
    onesEntries,
    reviewedRecords = []
  } = response.data;
  const authState = getAuthState(token);

  const apiResponse = mergeAPIResponses(
    normalizeUsers(...neededUsers, oneSelf),
    normalizeEntries(...onesEntries)
  );

  return {
    authState,
    apiResponse,
    oneSelf: UserN({
      ...oneSelf,
      children: [],
      childrenIds: oneSelf.children.map(c => c.id)
    }),
    reviewedRecords: Set(reviewedRecords)
  };
};

export const refreshToken = async (token: string): Promise<AuthState> => {
  try {
    const result = await axios.get<string>(
      `${getBaseUrl()}/token`,
      axiosTokenParams(token)
    );

    return getAuthState(result.data);
  } catch (error) {
    throw error;
  }
};

export const getChildren = async (token: string): Promise<APIResponse> => {
  const data = await get<UserDto[]>(
    `${getBaseUrl()}/users?filter=children`,
    token
  );
  return normalizeUsers(...data);
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
  return normalizeEntries(data);
};

export const getEntries = async (token: string): Promise<APIResponse> => {
  const data = await get<EntryDto[]>(`${getBaseUrl()}/entries`, token);
  return normalizeEntries(...data);
};

export const getSlots = async (token: string): Promise<APIResponse> => {
  const data = await get<SlotDto[]>(`${getBaseUrl()}/slots`, token);
  return normalizeSlots(...data);
};

export const getUser = async (
  id: string,
  token: string
): Promise<APIResponse> => {
  const data = await get<UserDto>(`${getBaseUrl()}/users/${id}`, token);
  return normalizeUsers(data);
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
  return normalizeUsers(...data);
};

export const post = async <T>(
  url: string,
  token: string,
  body?: {},
  config: AxiosRequestConfig = {}
) => {
  const response = await axios.post<T>(
    url,
    body,
    _.merge(axiosStandardParams(token), config)
  );
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
  return normalizeEntries(response);
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
  return normalizeUsers(...response);
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
  return normalizeUsers(response);
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
  return normalizeEntries(response);
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
  return normalizeEntries(response);
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
    deleteUsers,
    deleteStudentsAndParents
  }: {
    deleteUsers: boolean;
    deleteEntries: boolean;
    deleteStudentsAndParents: boolean;
  }
) => {
  const result = await post<UserDto[]>(
    `${getBaseUrl()}/instance/import?deleteUsers=${deleteUsers}&deleteEntries=${deleteEntries}&deleteStudentsAndParents=${deleteStudentsAndParents}`,
    token,
    dtos
  );
  return normalizeUsers(...result);
};

export const fetchInstanceConfig = async (): Promise<InstanceConfigDto> => {
  const response = await axios.get<InstanceConfigDto>(
    `${getBaseUrl()}/instanceConfig`
  );
  const { data } = response;
  return data;
};

export const setLoginBanner = async (
  language: Languages,
  text: string | null,
  token: string
): Promise<void> => {
  const response = await put(
    `${getBaseUrl()}/instanceConfig/loginBanners/${language}`,
    token,
    text,
    {
      transformResponse: [],
      headers: {
        "Content-Type": "text/plain"
      }
    }
  );
};

export const setDefaultLanguage = async (
  language: Languages,
  token: string
): Promise<void> => {
  const response = await put(
    `${getBaseUrl()}/instanceConfig/defaultLanguage`,
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

export const setParentSignatureNotificationTime = async (
  value: number,
  token: string
): Promise<void> => {
  const response = await put(
    `${getBaseUrl()}/instanceConfig/parentSignatureTimes/notification`,
    token,
    "" + value,
    {
      transformResponse: [],
      headers: {
        "Content-Type": "text/plain"
      }
    }
  );
};

export const setParentSignatureExpiryTime = async (
  value: number,
  token: string
): Promise<void> => {
  const response = await put(
    `${getBaseUrl()}/instanceConfig/parentSignatureTimes/expiry`,
    token,
    "" + value,
    {
      transformResponse: [],
      headers: {
        "Content-Type": "text/plain"
      }
    }
  );
};

export const setEntryCreationDays = async (
  value: number,
  token: string
): Promise<void> => {
  const response = await put(
    `${getBaseUrl()}/instanceConfig/entryCreationDeadline`,
    token,
    "" + value,
    {
      transformResponse: [],
      headers: {
        "Content-Type": "text/plain"
      }
    }
  );
};

export async function addReviewedRecord(token: string, entryId: string) {
  await axios.post(`${getBaseUrl()}/reviewedRecords`, entryId, {
    headers: {
      ...axiosStandardParams(token).headers,
      "Content-Type": "text/plain"
    }
  });
}

export const updateManagerNotes = async (
  studentId: string,
  value: string,
  token: string
): Promise<void> => {
  await put(`${getBaseUrl()}/users/${studentId}/managerNotes`, token, value, {
    transformResponse: [],
    headers: {
      "Content-Type": "text/plain"
    }
  });
};

export async function promoteTeacher(
  teacherId: string,
  _class: string,
  token: string
) {
  await post(`${getBaseUrl()}/users/${teacherId}/promote`, token, _class, {
    transformResponse: [],
    headers: {
      "Content-Type": "text/plain"
    }
  });
}

export async function demoteManager(managerId: string, token: string) {
  await post(`${getBaseUrl()}/users/${managerId}/demote`, token);
}
