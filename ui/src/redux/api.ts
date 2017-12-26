import { Entry, Slot, User, IEntryAPI, ISlotAPI, IUserAPI } from '../interfaces/index';
import axios, { AxiosRequestConfig } from 'axios';

const baseUrl = window ? `${location.protocol}//${location.hostname}:4000` : '';

const createUser = (item: IUserAPI): User => new User({
  _id: item._id,
  children: item.children ? item.children.map(child => createUser(child)) : [],
  email: item.email,
  role: item.role,
  username: item.username
});

const createSlot = (item: ISlotAPI) => new Slot({
  _id: item._id as string,
  date: new Date(item.date),
  hour_from: item.hour_from,
  hour_to: item.hour_to,
  signed: item.signed,
  teacher: createUser(item.teacher),
});

const createEntry = (item: IEntryAPI) => new Entry({
  _id: item._id as string,
  slots: item.slots.map((slot) => createSlot(slot)) as Slot[],
  forSchool: item.forSchool as boolean,
  date: new Date(item.date),
  signedAdmin: item.signedAdmin as boolean,
  signedParent: item.signedParent as boolean,
  student: createUser(item.student),
});

export const getEntries = async (): Promise<Entry[]> => {
  const url = `${baseUrl}/entries`;
  const config: AxiosRequestConfig = {
    auth: {
      username: 'admin',
      password: 'root',
    },
    method: 'GET',
  };
  const response = await axios.get(url, config);

  if (response.status === 304) {
    return [];
  }

  const data: IEntryAPI[] = response.data;
  const entries: Entry[] = data.map(item => createEntry(item));

  return entries;
};
