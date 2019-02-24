import { MigrationInterface, QueryRunner, TableColumn, Table } from "typeorm";

const keyValueStoreTable = new Table({
  name: "key_value_store",
  columns: [
    new TableColumn({
      name: "key",
      type: "varchar",
      isPrimary: true
    }),
    new TableColumn({
      name: "value",
      type: "varchar",
      isNullable: true
    })
  ]
});

export class AddKeyValueStoreTable1551014417000 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    queryRunner.createTable(keyValueStoreTable);
  }

  async down(queryRunner: QueryRunner) {
    queryRunner.dropTable(keyValueStoreTable);
  }
}
