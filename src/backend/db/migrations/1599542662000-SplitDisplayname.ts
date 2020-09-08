import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { TransactionMigration } from "./AsTransaction";

@TransactionMigration()
export class SplitDisplayname1599542662000 implements MigrationInterface {
  name = "SplitDisplayname1599542662000";

  async up(queryRunner: QueryRunner) {
    const firstName = new TableColumn({
      name: "firstName",
      type: "varchar",
      isNullable: false,
    });

    const lastName = new TableColumn({
      name: "lastName",
      type: "varchar",
      isNullable: false,
    });

    const firstNameWithDefault = firstName.clone();
    const lastNameWithDefault = lastName.clone();
    firstName.default = "''";
    lastName.default = "''";

    await queryRunner.addColumn("user", firstNameWithDefault);
    await queryRunner.addColumn("user", lastNameWithDefault);

    await queryRunner.query(`
      UPDATE user
      SET
        firstName = LEFT(displayname, CHAR_LENGTH(displayname) - LOCATE(' ', REVERSE(displayname))),
        lastName = SUBSTRING_INDEX(displayname, ' ', -1)
    `);

    await queryRunner.dropColumn("user", "displayname");
  }

  async down(queryRunner: QueryRunner) {
    const displayname = new TableColumn({
      name: "displayname",
      type: "varchar",
      isNullable: false,
      default: null,
    });

    const displaynameWithDefault = displayname.clone();
    displaynameWithDefault.default = "''";

    await queryRunner.addColumn("user", displaynameWithDefault);

    await queryRunner.query(`
      UPDATE user
      SET
        displayname = CONCAT(firstName, " ", lastName)
    `);

    await queryRunner.changeColumn("user", displaynameWithDefault, displayname);

    await queryRunner.dropColumn("user", "firstName");
    await queryRunner.dropColumn("user", "lastName");
  }
}
