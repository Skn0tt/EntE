import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { DEFAULT_LANGUAGE } from "ente-types";

const languageColumnNullable = new TableColumn({
  name: "language",
  type: "varchar",
  isNullable: true
});

const languageColumn = new TableColumn({
  name: "language",
  type: "varchar",
  isNullable: false
});

export class AddLanguageFieldToUser1545942329000 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn("user", languageColumnNullable);
    const defaultLanguage = DEFAULT_LANGUAGE;
    await queryRunner.query("UPDATE user SET `language` = ?", [
      defaultLanguage
    ]);
    await queryRunner.changeColumn(
      "user",
      languageColumnNullable,
      languageColumn
    );
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropColumn("user", languageColumn);
  }
}
