import { MigrationInterface, TableColumn, QueryRunner } from "typeorm";

export class MakeKeyValueStoreTextType1551372598000
  implements MigrationInterface {
  name = "MakeKeyValueStoreTextType1551372598000";
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      `ALTER TABLE key_value_store
        MODIFY value
        TEXT;`
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      `ALTER TABLE key_value_store
        MODIFY value
        TEXT;`
    );
  }
}
