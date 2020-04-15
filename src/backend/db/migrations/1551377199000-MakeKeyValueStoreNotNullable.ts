import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeKeyValueStoreNotNullable1551377199000
  implements MigrationInterface {
  name = "MakeKeyValueStoreNotNullable1551377199000";
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      `DELETE FROM key_value_store
       WHERE value IS NULL;`
    );

    await queryRunner.query(
      `ALTER TABLE key_value_store
       MODIFY value
       TEXT NOT NULL;`
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
