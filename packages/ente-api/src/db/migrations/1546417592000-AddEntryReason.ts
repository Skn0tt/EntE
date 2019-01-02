import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from "typeorm";

const categoryColumn = new TableColumn({
  name: "reasonCategory",
  type: "varchar",
  isNullable: true
});

const fromColumn = new TableColumn({
  name: "reasonFrom",
  type: "smallint",
  isNullable: true
});

const toColumn = new TableColumn({
  name: "reasonTo",
  type: "smallint",
  isNullable: true
});

const descriptionColumn = new TableColumn({
  name: "reasonDescription",
  type: "varchar",
  isNullable: true
});

const teacherColumn = new TableColumn({
  name: "teacher_id",
  type: "varchar",
  isNullable: true
});

const forSchoolColumnNullable = new TableColumn({
  name: "forSchool",
  type: "tinyint",
  isNullable: true
});

const forSchoolColumn = new TableColumn({
  name: "forSchool",
  type: "tinyint",
  isNullable: false
});

const teacherForeignKey = new TableForeignKey({
  columnNames: ["teacher_id"],
  referencedTableName: "user",
  referencedColumnNames: ["_id"],
  onDelete: "SET NULL"
});

export class AddEntryReason1546417592000 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumns("entry", [
      categoryColumn,
      fromColumn,
      toColumn,
      descriptionColumn,
      teacherColumn
    ]);

    await queryRunner.createForeignKey("entry", teacherForeignKey);

    await queryRunner.query(
      "UPDATE `entry` SET `reasonCategory` = 'other', `reasonDescription` = 'N/A' WHERE `forSchool` = 1"
    );

    await queryRunner.dropColumn("entry", "forSchool");
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.addColumn("entry", forSchoolColumnNullable);

    await queryRunner.query(
      "UPDATE `entry` SET `forSchool` = IF(`category` IS NULL, 0, 1)"
    );

    await queryRunner.changeColumn(
      "entry",
      forSchoolColumnNullable,
      forSchoolColumn
    );

    await queryRunner.dropColumns("entry", [
      categoryColumn,
      fromColumn,
      toColumn,
      descriptionColumn,
      teacherColumn
    ]);
  }
}
