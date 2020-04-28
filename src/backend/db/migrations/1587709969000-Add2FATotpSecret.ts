import { MigrationInterface, TableColumn, QueryRunner } from "typeorm";

export class Add2FATotpSecret1587709969000 implements MigrationInterface {
  name = "Add2FATotpSecret1587709969000";

  totpSecret = new TableColumn({
    name: "totpSecret",
    type: "varchar",
    isNullable: true,
    default: null,
  });

  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn("user", this.totpSecret);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn("user", this.totpSecret);
  }
}
