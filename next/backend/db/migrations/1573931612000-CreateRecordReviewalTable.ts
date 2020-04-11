import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  Table,
  TableForeignKey,
} from "typeorm";
import { User } from "../user.entity";
import { RecordReviewal } from "../recordReviewal.entity";

/**
 * @param charSet is dynamically defined, based upon existing column
 */
const recordReviewalTable = (charset: string) =>
  new Table({
    name: "record_reviewal",
    columns: [
      new TableColumn({
        name: "user_id",
        type: "varchar",
        isPrimary: true,
        isNullable: false,
        charset,
      }),
      new TableColumn({
        name: "recordId",
        type: "varchar",
        isPrimary: true,
        isNullable: false,
      }),
    ],
    foreignKeys: [
      new TableForeignKey({
        referencedTableName: "user",
        columnNames: ["user_id"],
        referencedColumnNames: ["_id"],
        onDelete: "CASCADE",
      }),
    ],
  });

export class CreateRecordReviewalTable1573931612000
  implements MigrationInterface {
  async getCharSetOfUserIdColumn(qr: QueryRunner) {
    const [{ character_set_name }] = await qr.query(
      'SELECT character_set_name FROM information_schema.`COLUMNS` WHERE table_name = "user" AND column_name = "_id";'
    );
    return character_set_name;
  }

  async createDDL(qr: QueryRunner) {
    const charset = await this.getCharSetOfUserIdColumn(qr);
    return recordReviewalTable(charset);
  }

  async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(await this.createDDL(queryRunner));

    const managerAndEntries = await queryRunner.query(
      "SELECT manager._id AS managerId, entry._id AS entryId FROM entry JOIN user AS `student` ON student_id = student._id JOIN user AS `manager` ON `student`.`graduationYear` = `manager`.`graduationYear` WHERE manager.role = 'manager';"
    );
    const managerAndSlots = await queryRunner.query(
      "SELECT manager._id AS managerId, slot._id AS slotId FROM slot JOIN entry ON slot.entry_id = entry._id JOIN user AS `student` ON student_id = student._id JOIN user AS `manager` ON `student`.`graduationYear` = `manager`.`graduationYear` WHERE manager.role = 'manager';"
    );
    const teacherAndSlots = await queryRunner.query(
      "SELECT teacher._id AS teacherId, slot._id AS slotId FROM slot JOIN user AS teacher ON slot.teacher_id = teacher._id WHERE teacher.role = 'teacher';"
    );

    const pairs: [string, string][] = [
      ...managerAndEntries.map(
        ({ managerId, entryId }: { managerId: string; entryId: string }) => [
          managerId,
          entryId,
        ]
      ),
      ...managerAndSlots.map(
        ({ managerId, slotId }: { managerId: string; slotId: string }) => [
          managerId,
          slotId,
        ]
      ),
      ...teacherAndSlots.map(
        ({ teacherId, slotId }: { teacherId: string; slotId: string }) => [
          teacherId,
          slotId,
        ]
      ),
    ];

    if (pairs.length === 0) {
      return;
    }

    await queryRunner.manager.insert(
      RecordReviewal,
      pairs.map(([user, recordId]) => ({
        user: { _id: user } as User,
        recordId,
      }))
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable(recordReviewalTable("charset does not matter"));
  }
}
