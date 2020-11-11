import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionMigration } from "./AsTransaction";

const oldCategories = [
  "examen",
  "field_trip",
  "competition",
  "other_educational",
  "other_non_educational",
  "illness",
];

const newCategories = [...oldCategories, "quarantine"];

@TransactionMigration()
export class AddQuarantineReason1605087825000 implements MigrationInterface {
  name = "AddQuarantineReason1605087825000";

  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      `
      ALTER TABLE entry
      MODIFY reasonCategory
      ENUM(?);
    `,
      [newCategories]
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      `
      UPDATE entry
      SET reasonCategory = 'illness'
      WHERE reasonCategory = 'quarantine';
    `
    );

    await queryRunner.query(
      `
      ALTER TABLE entry
      MODIFY reasonCategory
      ENUM(?);
    `,
      [oldCategories]
    );
  }
}
