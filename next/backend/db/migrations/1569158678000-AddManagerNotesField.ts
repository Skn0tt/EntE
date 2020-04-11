import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

const newManagerNotesColumn = new TableColumn({
  name: "managerNotes",
  isNullable: false,
  type: "varchar",
  default: "''",
});

export class AddManagerNotesField1569158678000 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn("user", newManagerNotesColumn);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn("user", newManagerNotesColumn);
  }
}
