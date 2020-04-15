import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class MakeSlotDateNullable1544015021618 implements MigrationInterface {
  name = "MakeSlotDateNullable1544015021618";
  static oldColumn = new TableColumn({
    name: "date",
    type: "date",
    isNullable: false,
  });

  static newColumn = new TableColumn({
    name: "date",
    type: "date",
    isNullable: true,
  });

  async up(queryRunner: QueryRunner) {
    await queryRunner.changeColumn(
      "slot",
      MakeSlotDateNullable1544015021618.oldColumn,
      MakeSlotDateNullable1544015021618.newColumn
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.changeColumn(
      "slot",
      MakeSlotDateNullable1544015021618.newColumn,
      MakeSlotDateNullable1544015021618.oldColumn
    );
  }
}
