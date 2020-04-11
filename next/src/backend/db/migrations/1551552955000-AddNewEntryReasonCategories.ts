import { MigrationInterface, QueryRunner } from "typeorm";
import * as _ from "lodash";

const oldCategories = ["examen", "field_trip", "competition", "other"];

const newCategories = [
  "examen",
  "field_trip",
  "competition",
  "other_educational",
  "other_non_educational",
  "illness",
];

const jointCategories = _.uniq(oldCategories.concat(newCategories));

export class AddNewEntryReasonCategories1551552955000
  implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.query(
      `
      ALTER TABLE entry
      MODIFY reasonCategory
      ENUM(?);
    `,
      [jointCategories]
    );

    await queryRunner.query(`
      UPDATE entry
      SET reasonCategory = 'other_educational'
      WHERE reasonCategory = 'other';
    `);

    await queryRunner.query(`
      UPDATE entry
      SET reasonCategory = 'illness'
      WHERE reasonCategory IS NULL;
    `);

    await queryRunner.query(
      `
      ALTER TABLE entry
      MODIFY reasonCategory
      ENUM(?) NOT NULL;
    `,
      [newCategories]
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(
      `
      ALTER TABLE entry
      MODIFY reasonCategory
      ENUM(?);
    `,
      [jointCategories]
    );

    await queryRunner.query(`
      UPDATE entry
      SET reasonCategory = NULL
      WHERE reasonCategory = 'illness';
    `);

    await queryRunner.query(`
      UPDATE entry
      SET reasonCategory = 'other'
      WHERE reasonCategory = 'other_educational';
    `);

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
