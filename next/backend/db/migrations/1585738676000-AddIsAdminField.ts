import { MigrationInterface, TableColumn, QueryRunner } from "typeorm";

export class AddIsAdminField1585738676000 implements MigrationInterface {
  isAdmin = new TableColumn({
    name: "isAdmin",
    type: "tinyint",
    isNullable: false,
    default: false,
  });

  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn("user", this.isAdmin);

    await queryRunner.query(`
      UPDATE user
      SET user.isAdmin = 1
      WHERE user.role = 'admin'
    `);

    await queryRunner.query(`
      UPDATE user
      SET user.role = 'teacher'
      WHERE user.role = 'admin'
    `);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.query(`
      UPDATE user
      SET user.role = 'admin'
      WHERE user.isTeacher = 1
    `);

    await queryRunner.dropColumn("user", this.isAdmin);
  }
}
