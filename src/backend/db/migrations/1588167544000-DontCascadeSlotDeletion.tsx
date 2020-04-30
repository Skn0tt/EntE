import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class DontCascadeSlotDeletion1588167544000
  implements MigrationInterface {
  name = "DontCascadeSlotDeletion1588167544000";

  async getOldFKConstraint(queryRunner: QueryRunner) {
    const slot = await queryRunner.getTable("slot");
    const entryIdFk = slot!.foreignKeys.find((fk) =>
      fk.columnNames.includes("entry_id")
    );
    return entryIdFk!;
  }

  async alterOnDelete(queryRunner: QueryRunner, newValue: string) {
    await queryRunner.dropForeignKey(
      "slot",
      await this.getOldFKConstraint(queryRunner)
    );

    await queryRunner.createForeignKey(
      "slot",
      new TableForeignKey({
        referencedTableName: "entry",
        columnNames: ["entry_id"],
        referencedColumnNames: ["_id"],
        onDelete: newValue,
      })
    );
  }

  async up(queryRunner: QueryRunner) {
    await this.alterOnDelete(queryRunner, "SET NULL");
  }

  async down(queryRunner: QueryRunner) {
    await this.alterOnDelete(queryRunner, "CASCADE");
  }
}
