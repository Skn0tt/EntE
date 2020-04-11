import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

const oldSignedManagerColumn = new TableColumn({
  name: "signedManager",
  isNullable: false,
  type: "tinyint",
});

const oldSignedParentColumn = new TableColumn({
  name: "signedParent",
  isNullable: false,
  type: "tinyint",
});

const newManagerSignatureDateColumn = new TableColumn({
  name: "managerSignatureDate",
  isNullable: true,
  type: "date",
});

const newParentSignatureDateColumn = new TableColumn({
  name: "parentSignatureDate",
  isNullable: true,
  type: "date",
});

export class SaveSignatureDates1557748840000 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn("entry", newManagerSignatureDateColumn);
    await queryRunner.addColumn("entry", newParentSignatureDateColumn);

    await queryRunner.query(
      `UPDATE entry SET managerSignatureDate = '2000-01-01' WHERE signedManager != 0;`
    );
    await queryRunner.query(
      `UPDATE entry SET parentSignatureDate = '2000-01-01' WHERE signedParent != 0;`
    );

    await queryRunner.dropColumn("entry", oldSignedManagerColumn);
    await queryRunner.dropColumn("entry", oldSignedParentColumn);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.addColumn("entry", oldSignedManagerColumn);
    await queryRunner.addColumn("entry", oldSignedParentColumn);

    await queryRunner.query(
      `UPDATE entry SET signedManager = 1 WHERE managerSignatureDate IS NOT NULL;`
    );
    await queryRunner.query(
      `UPDATE entry SET signedParent = 1 WHERE parentSignatureDate IS NOT NULL;`
    );

    await queryRunner.dropColumn("entry", newParentSignatureDateColumn);
    await queryRunner.dropColumn("entry", newManagerSignatureDateColumn);
  }
}
