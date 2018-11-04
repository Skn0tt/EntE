import { UserRepo } from "../db/user.repo";
import { EntryRepo } from "../db/entry.repo";
import { SlotRepo } from "../db/slot.repo";
import { createSpreadsheet } from "../helpers/excel";
import { UserDto, Roles } from "ente-types";
import { Fail, Validation, Success } from "monet";
import { Inject } from "@nestjs/common";

export enum ExportExcelFailure {
  ForbiddenForRole
}

export class ExportService {
  constructor(
    @Inject(UserRepo) private readonly userRepo: UserRepo,
    @Inject(EntryRepo) private readonly entryRepo: EntryRepo,
    @Inject(SlotRepo) private readonly slotRepo: SlotRepo
  ) {}

  async getExcelExport(
    requestingUser: UserDto
  ): Promise<Validation<ExportExcelFailure, Buffer>> {
    const userIsAdmin = requestingUser.role === Roles.ADMIN;
    if (!userIsAdmin) {
      return Fail(ExportExcelFailure.ForbiddenForRole);
    }

    const users = await this.userRepo.findAll();
    const entries = await this.entryRepo.findAll();
    const slots = await this.slotRepo.findAll();

    const spreadsheet = await createSpreadsheet(
      {
        title: "Users",
        headers: [
          "id",
          "username",
          "displayname",
          "email",
          "role",
          "isAdult",
          "graduationYear",
          "children"
        ],
        rows: users.map(u => [
          u.id,
          u.username,
          u.displayname,
          u.email,
          u.role,
          "" + u.isAdult,
          "" + u.graduationYear,
          u.children.map(c => c.username).join(", ")
        ])
      },
      {
        title: "Entries",
        headers: [
          "id",
          "date",
          "dateEnd",
          "username",
          "forSchool",
          "createdAt",
          "signedManager",
          "signedParent",
          "slots..."
        ],
        rows: entries.map(e => [
          e.id,
          e.date.toISOString(),
          e.dateEnd.toISOString(),
          e.student.username,
          "" + e.forSchool,
          e.createdAt.toISOString(),
          "" + e.signedManager,
          "" + e.signedParent,
          ...e.slots.map(
            s =>
              `${s.date.toISOString()}, ${s.teacher.username}, ${s.from}, ${
                s.to
              }`
          )
        ])
      },
      {
        title: "Slots",
        headers: ["id", "date", "teacher", "student", "from", "to", "signed"],
        rows: slots.map(s => [
          s.id,
          s.date.toISOString(),
          s.teacher.username,
          s.student.username,
          "" + s.from,
          "" + s.to,
          "" + s.signed
        ])
      }
    );

    return Success(spreadsheet);
  }
}
