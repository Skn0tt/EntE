import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  Table,
  TableForeignKey
} from "typeorm";
import { User } from "../user.entity";
import { RecordReviewal } from "../recordReviewal.entity";

const recordReviewalTable = new Table({
  name: "record_reviewal",
  columns: [
    new TableColumn({
      name: "user_id",
      type: "char",
      isPrimary: true,
      length: "36"
    }),
    new TableColumn({
      name: "recordId",
      type: "char",
      isPrimary: true,
      isNullable: false,
      length: "36"
    })
  ],
  foreignKeys: [
    new TableForeignKey({
      referencedTableName: "user",
      columnNames: ["user_id"],
      referencedColumnNames: ["_id"],
      onDelete: "CASCADE"
    })
  ]
});

export class CreateRecordReviewalTable1573931612000
  implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    queryRunner.createTable(recordReviewalTable);

    const managerAndEntries = await queryRunner.query(
      "SELECT manager._id AS managerId, entry._id AS entryId FROM entry JOIN user AS `student` ON student_id = student._id JOIN user AS `manager` ON `student`.`graduationYear` = `manager`.`graduationYear`;"
    );
    const managerAndSlots = await queryRunner.query(
      "SELECT manager._id AS managerId, slot._id AS slotId FROM slot JOIN entry ON slot.entry_id = entry._id JOIN user AS `student` ON student_id = student._id JOIN user AS `manager` ON `student`.`graduationYear` = `manager`.`graduationYear`;"
    );
    const teacherAndSlots = await queryRunner.query(
      "SELECT teacher._id AS teacherId, slot._id AS slotId FROM slot JOIN user AS teacher ON slot.teacher_id = teacher._id;"
    );

    const pairs: [string, string][] = [
      ...managerAndEntries.map(
        ({ managerId, entryId }: { managerId: string; entryId: string }) => [
          managerId,
          entryId
        ]
      ),
      ...managerAndSlots.map(
        ({ managerId, slotId }: { managerId: string; slotId: string }) => [
          managerId,
          slotId
        ]
      ),
      ...teacherAndSlots.map(
        ({ teacherId, slotId }: { teacherId: string; slotId: string }) => [
          teacherId,
          slotId
        ]
      )
    ];

    if (pairs.length === 0) {
      return;
    }

    await queryRunner.manager.insert(
      RecordReviewal,
      pairs.map(([user, recordId]) => ({
        user: { _id: user } as User,
        recordId
      }))
    );
  }

  async down(queryRunner: QueryRunner) {
    queryRunner.dropTable(recordReviewalTable);
  }
}
