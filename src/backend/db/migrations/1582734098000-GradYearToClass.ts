import { MigrationInterface, TableColumn, QueryRunner } from "typeorm";

export class GradYearToClass1582734098000 implements MigrationInterface {
  class = new TableColumn({
    name: "class",
    type: "varchar",
    isNullable: true,
  });

  gradYear = new TableColumn({
    name: "graduationYear",
    type: "smallint",
    isNullable: true,
  });

  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn("user", this.class);

    await queryRunner.query(`
      UPDATE user
      SET user.class = CAST(user.graduationYear AS CHAR(4))
      WHERE user.graduationYear IS NOT NULL  
    `);

    await queryRunner.dropColumn("user", this.gradYear);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn("user", this.gradYear);

    await queryRunner.query(`
      UPDATE user
      SET user.graduationYear = CAST(user.class AS UNSIGNED)
      WHERE user.class IS NOT NULL
    `);

    await queryRunner.dropColumn("user", this.class);
  }
}
