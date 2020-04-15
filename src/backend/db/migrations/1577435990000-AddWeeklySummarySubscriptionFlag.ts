import { MigrationInterface, TableColumn, QueryRunner } from "typeorm";

export class AddWeeklySummarySubscriptionFlag1577435990000
  implements MigrationInterface {
  name = "AddWeeklySummarySubscriptionFlag1577435990000";

  col = new TableColumn({
    name: "subscribedToWeeklySummary",
    type: "tinyint",
    default: true,
    isNullable: false,
  });

  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn("user", this.col);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn("user", this.col);
  }
}
