import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

const isAdultColumn = new TableColumn({
  name: "isAdult",
  type: "tinyint",
});

const birthdayColumn = new TableColumn({
  name: "birthday",
  type: "date",
  isNullable: true,
});

const userTable = new Table({
  name: "user",
});

export class ReplaceIsAdultByBirthday1545584116000
  implements MigrationInterface {
  name = "ReplaceIsAdultByBirthday1545584116000";
  async up(queryRunner: QueryRunner) {
    await queryRunner.addColumn(userTable, birthdayColumn);
    queryRunner.query(
      "UPDATE `user` SET `birthday` = IF(`isAdult` = 1, '1970-01-01', '2100-01-01') WHERE `user`.`role` = 'student'"
    );
    await queryRunner.dropColumn(userTable, isAdultColumn);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.addColumn(userTable, isAdultColumn);
    queryRunner.query(
      "UPDATE `user` SET `isAdult` = IF(CURDATE() <= `birthday`, 1, 0) WHERE `birthday` IS NOT NULL"
    );
    await queryRunner.dropColumn(userTable, birthdayColumn);
  }
}
