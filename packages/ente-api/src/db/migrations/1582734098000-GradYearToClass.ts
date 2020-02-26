import { MigrationInterface, TableColumn, QueryRunner } from "typeorm";

export class GradYearToClass1582734098000 implements MigrationInterface {
  class = new TableColumn({
    name: "class",
    type: "varchar",
    isNullable: true
  });

  gradYear = new TableColumn({
    name: "graduationYear",
    type: "smallint",
    isNullable: true
  });

  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn("user", this.class);

    await queryRunner.query(`
      UPDATE user
      WHERE user.graduationYear NOT NULL
      SET user.class = CAST(user.graduationYear AS VARCHAR(255))
    `);

    await queryRunner.dropColumn("user", this.gradYear);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn("user", this.gradYear);

    await queryRunner.query(`
      UPDATE user
      WHERE user.class NOT NULL
      SET user.graduationYear = CAST(user.class AS UNSIGNED)
    `);

    await queryRunner.dropColumn("user", this.class);
  }
}
