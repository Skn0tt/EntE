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
    .leftJoinAndSelect("entry.student", "student")
    .leftJoinAndSelect("entry.slots", "slot")
    .where("entry.date >= :date", { date: lastAugustFirst() });

const allThisYear = async () => {
  const entries = await thisYearQuery().getMany();

  return entries.map(entryToJson);
};

const allThisYearBy = async (students: UserId[]) => {
  const entries = await thisYearQuery()
    .andWhere("student._id IN (:students)", { students })
    .getMany();

  return entries.map(entryToJson);
};

const findById = async (id: EntryId) => {
  const entry = await entryRepo().findOneById(id);
  return !!entry ? entryToJson(entry) : null;
};

type CreateResult = { entry: IEntry; slots: ISlot[] };
const create = async (
  entry: IEntryCreate,
  signedParent: boolean
): Promise<CreateResult> =>
  await getConnection().transaction(async (manager): Promise<CreateResult> => {
    const student = await manager.findOneById(User, entry.student);

    const newEntry = await manager.create(Entry, {
      student,
      signedParent,
      date: entry.date,
      dateEnd: entry.dateEnd,
      reason: entry.reason,
      forSchool: entry.forSchool,
      slots: await Promise.all(
        entry.slots.map(async s => {
          return await manager.create(Slot, {
            ...s,
            teacher: await manager.findOneById(User, s.teacher)
          });
        })
      )
    });

    newEntry.slots.forEach((_, i) => {
      newEntry.slots[i].entry = newEntry;
    });

    await manager.save(Entry, newEntry);
    await manager.save(Slot, newEntry.slots);

    console.log(newEntry);

    return {
      entry: entryToJson(newEntry),
      slots: newEntry.slots.map(slotToJson)
    };
  });

const update = (updater: (e: Entry) => Entry) => (
  validator: Validator<IEntry>
) => async (id: EntryId) => {
  const entry = await entryRepo().findOneById(id);
  if (!entry || !validator(entryToJson(entry))) {
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
