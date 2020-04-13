import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveInconsistentUserAttributes1551534415000
  implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await this.removeInconsistentBirthdays(queryRunner);
    await this.removeInconsistentGradYears(queryRunner);
  }

  private async removeInconsistentBirthdays(queryRunner: QueryRunner) {
    await queryRunner.query(
      `UPDATE user
      SET graduationYear = NULL
      WHERE role NOT IN ('student', 'manager');`
    );
  }

  private async removeInconsistentGradYears(queryRunner: QueryRunner) {
    await queryRunner.query(
      `UPDATE user
      SET birthday = NULL
      WHERE role != 'student';`
    );
  }

  async down(queryRunner: QueryRunner) {}
}
