import { MigrationInterface, QueryRunner } from "typeorm";

const rolesAtThatPoint = ["parent", "student", "teacher", "admin", "manager"];

const entryReasonCategoriesAtThatPoint = [
  "examen",
  "field_trip",
  "competition",
  "other",
];

export class UseEnumType1551372175000 implements MigrationInterface {
  name = "UseEnumType1551372175000";
  async up(queryRunner: QueryRunner) {
    // role
    await queryRunner.query(
      `ALTER TABLE user
        MODIFY role
        ENUM(?);`,
      [rolesAtThatPoint]
    );

    // reason.category
    await queryRunner.query(
      `ALTER TABLE entry
        MODIFY reasonCategory
        ENUM(?);`,
      [entryReasonCategoriesAtThatPoint]
    );
  }

  async down(queryRunner: QueryRunner) {
    // role
    await queryRunner.query(
      `ALTER TABLE user
        MODIFY role
        varchar(60);`
    );

    // reason.category
    await queryRunner.query(
      `ALTER TABLE entry
        MODIFY reasonCategory
        varchar(60);`
    );
  }
}
