import { MigrationInterface, TableColumn, QueryRunner } from "typeorm";

export class AddManagerReachedOutField1585989168000
  implements MigrationInterface {
  name = "AddManagerReachedOutField1585989168000";

  managerReachedOut = new TableColumn({
    name: "managerReachedOut",
    type: "tinyint",
    isNullable: false,
    default: false,
  });

  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn("entry", this.managerReachedOut);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn("entry", this.managerReachedOut);
  }
}
