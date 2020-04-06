import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPrefiledSlots1586165238000 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      `ALTER TABLE slot
        MODIFY entry_id
          varchar(255) DEFAULT NULL;
      `
    );

    await queryRunner.addColumn(
      "slot",
      new TableColumn({
        name: "prefiled_for",
        type: ""
      })
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      `ALTER TABLE slot
        MODIFY entry_id
          varchar(255) NOT NULL;
      `
    );

    await queryRunner.query(
      `DELETE FROM slot
       WHERE prefiled_for IS NOT NULL;
      `
    );

    await queryRunner.dropColumn("slot", "prefiled_for");
  }
}
