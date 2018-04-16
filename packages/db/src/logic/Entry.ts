import { getRepository, Repository, getConnection } from "typeorm";
import Entry from "../entity/Entry";
import { lastAugustFirst } from "../helpers/date";
import {
  IEntry,
  UserId,
  EntryId,
  IEntryCreate,
  ISlotCreate,
  ISlot
} from "ente-types";
import User from "../entity/User";
import * as _ from "lodash";
import Slot from "../entity/Slot";
import { slotToJson } from "./Slot";
import { Validator } from "./types";

const entryRepo = () => getRepository(Entry);

const entryToJson = (entry: Entry): IEntry => ({
  _id: entry._id,
  date: entry.date,
  dateEnd: entry.dateEnd,
  signedManager: entry.signedManager,
  signedParent: entry.signedParent,
  forSchool: entry.forSchool,
  slots: entry.slots.map(s => s._id),
  reason: entry.reason,
  student: entry.student._id,
  updatedAt: entry.updatedAt,
  createdAt: entry.createdAt
});

const thisYearQuery = () =>
  entryRepo()
    .createQueryBuilder("entry")
    .where("entry.date >= :date", { date: lastAugustFirst() });

const allThisYear = async () => {
  const entries = await thisYearQuery().getMany();

  return entries.map(entryToJson);
};

const allThisYearBy = async (students: UserId[]) => {
  const entries = await thisYearQuery()
    .andWhere("entry.student IN (:students)", { students })
    .getMany();

  return entries.map(entryToJson);
};

const findById = async (id: EntryId) => {
  const entry = await entryRepo().findOneById(id);
  return !!entry ? entryToJson(entry) : null;
};

const toEntry = (base: Partial<Entry>) => (
  e: IEntryCreate
): Partial<Entry> => ({
  ...base,
  date: e.date,
  dateEnd: e.dateEnd,
  forSchool: e.forSchool,
  reason: e.reason,
  slots: [],
  signedParent: false
});
const toSlot = (teachers: User[], entry: Entry) => (
  s: ISlotCreate
): Partial<Slot> => ({
  entry,
  hour_from: s.hour_from,
  hour_to: s.hour_to,
  teacher: teachers.find(t => t._id === s.teacher)
});

type CreateResult = { entry: IEntry; slots: ISlot[] };
const create = async (
  entry: IEntryCreate,
  signedParent: boolean
): Promise<CreateResult> =>
  await getConnection().transaction(async (manager): Promise<CreateResult> => {
    const convertedEntry = toEntry({ signedParent })(entry);
    const newEntry = await manager.create(Entry, convertedEntry);

    await manager.save(Entry, newEntry);

    const teachers = await manager.findByIds(
      User,
      entry.slots.map(s => s.teacher)
    );
    const convertedSlots = entry.slots.map(toSlot(teachers, newEntry));
    const newSlots = await manager.create(Slot, convertedSlots);

    await manager.save(Slot, newSlots);

    return { entry: entryToJson(newEntry), slots: newSlots.map(slotToJson) };
  });

const update = (updater: (e: Entry) => Entry) => (
  validator: Validator<IEntry>
) => async (id: EntryId) => {
  const entry = await entryRepo().findOneById(id);
  if (!entry || validator(entryToJson(entry))) {
    return null;
  }

  const newEntry = updater(entry);

  await entryRepo().save(newEntry);

  return entryToJson(newEntry);
};

const setForSchool = (value: boolean) =>
  update(e => {
    e.forSchool = value;
    return e;
  });

const setSignedManager = (value: boolean) =>
  update(e => {
    e.signedManager = value;
    return e;
  });

const setSignedParent = (value: boolean) =>
  update(e => {
    e.signedParent = value;
    return e;
  });

export default {
  allThisYear,
  allThisYearBy,
  findById,
  create,
  setForSchool,
  setSignedManager,
  setSignedParent
};
