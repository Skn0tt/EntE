import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrefiledSlots1586165238000 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      `ALTER TABLE slot
        MODIFY entry_id
          varchar(255) DEFAULT NULL
      `
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      `ALTER TABLE slot
        MODIFY entry_id
          varchar(255) NOT NULL
      `
    );
  }
}
