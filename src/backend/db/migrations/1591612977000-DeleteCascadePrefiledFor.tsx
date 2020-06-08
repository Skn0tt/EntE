import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";
import { AddPrefiledSlots1586165238000 } from "./1586165238000-AddPrefiledSlots";

export class DeleteCascadePrefiledFor1591612977000
  implements MigrationInterface {
  name = "DeleteCascadePrefiledFor1591612977000";

  fk = new TableForeignKey({
    onDelete: "CASCADE",
    columnNames: ["prefiledFor_id"],
    referencedTableName: "user",
    referencedColumnNames: ["_id"],
  });

  oldFk = new AddPrefiledSlots1586165238000().fk;

  async dropForeignKey(fk: string, queryRunner: QueryRunner) {
    await queryRunner.query(
      `ALTER TABLE slot
      DROP FOREIGN KEY ${fk};`
    );
  }

  async dropExistingFk(queryRunner: QueryRunner) {
    const [{ CONSTRAINT_NAME }] = await queryRunner.query(
      `SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_NAME = 'slot'
      AND COLUMN_NAME = 'prefiledFor_id';`
    );

    await this.dropForeignKey(CONSTRAINT_NAME, queryRunner);
  }

  async up(queryRunner: QueryRunner) {
    await this.dropExistingFk(queryRunner);
    await queryRunner.query(
      `ALTER TABLE slot
      ADD CONSTRAINT FK_prefiledFor_id
      FOREIGN KEY (prefiledFor_id) REFERENCES user(_id) ON DELETE CASCADE;`
    );
  }

  async down(queryRunner: QueryRunner) {
    await this.dropForeignKey("FK_prefiledFor_id", queryRunner);
    await queryRunner.query(
      `ALTER TABLE slot
      ADD CONSTRAINT FK_prefiledFor_id
      FOREIGN KEY (prefiledFor_id) REFERENCES user(_id) ON DELETE SET NULL;`
    );
  }
}
