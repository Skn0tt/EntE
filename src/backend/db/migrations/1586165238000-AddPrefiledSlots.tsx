import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AddPrefiledSlots1586165238000 implements MigrationInterface {
  name = "AddPrefiledSlots1586165238000";

  fk = new TableForeignKey({
    onDelete: "SET NULL",
    columnNames: ["prefiledFor_id"],
    referencedTableName: "user",
    referencedColumnNames: ["_id"],
  });

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
        name: "prefiledFor_id",
        isNullable: true,
        type: "varchar(255)",
      })
    );

    await queryRunner.createForeignKey("slot", this.fk);
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
       WHERE prefiledFor_id IS NOT NULL;
      `
    );

    await queryRunner.dropForeignKey("slot", this.fk);

    await queryRunner.dropColumn("slot", "prefiledFor_id");
  }
}
