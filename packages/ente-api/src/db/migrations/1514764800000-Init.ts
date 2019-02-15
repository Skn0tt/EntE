import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey
} from "typeorm";

const _id = new TableColumn({
  name: "_id",
  type: "varchar",
  generatedType: "STORED",
  generationStrategy: "uuid",
  isGenerated: true,
  isPrimary: true,
  isNullable: false,
  isUnique: true
});

const entryTable = new Table({
  name: "entry",
  columns: [
    _id,
    new TableColumn({
      name: "date",
      type: "datetime",
      isNullable: false
    }),
    new TableColumn({
      name: "dateEnd",
      type: "datetime",
      isNullable: true
    }),
    new TableColumn({
      name: "forSchool",
      type: "tinyint",
      isNullable: false
    }),
    new TableColumn({
      name: "signedManager",
      type: "tinyint",
      isNullable: false
    }),
    new TableColumn({
      name: "signedParent",
      type: "tinyint",
      isNullable: false
    }),
    new TableColumn({
      name: "createdAt",
      type: "datetime",
      isNullable: false,
      default: "current_timestamp()"
    }),
    new TableColumn({
      name: "updatedAt",
      type: "datetime",
      isNullable: false,
      default: "current_timestamp()"
    }),
    new TableColumn({
      name: "student_id",
      type: "varchar",
      isNullable: false,
    })
  ],
  foreignKeys: [
    new TableForeignKey({
      name: "entry",
      referencedTableName: "user",
      columnNames: ["student_id"],
      referencedColumnNames: ["_id"],
      onDelete: "CASCADE"
    })
  ]
});

const slotTable = new Table({
  name: "slot",
  columns: [
    _id,
    new TableColumn({
      name: "date",
      type: "date",
      isNullable: false
    }),
    new TableColumn({
      name: "hour_from",
      type: "tinyint",
      isNullable: false
    }),
    new TableColumn({
      name: "hour_to",
      type: "tinyint",
      isNullable: false
    }),
    new TableColumn({
      name: "teacher_id",
      type: "varchar",
      isNullable: true
    }),
    new TableColumn({
      name: "entry_id",
      type: "varchar",
      isNullable: false
    })
  ],
  foreignKeys: [
    new TableForeignKey({
      referencedTableName: "entry",
      columnNames: ["entry_id"],
      referencedColumnNames: ["_id"],
      onDelete: "CASCADE"
    }),
    new TableForeignKey({
      referencedTableName: "user",
      columnNames: ["teacher_id"],
      referencedColumnNames: ["_id"],
      onDelete: "SET NULL"
    })
  ]
});

const userTable = new Table({
  name: "user",
  columns: [
    _id,
    new TableColumn({
      name: "username",
      type: "varchar",
      isNullable: false,
      isUnique: true
    }),
    new TableColumn({
      name: "displayname",
      type: "varchar",
      isNullable: false
    }),
    new TableColumn({
      name: "email",
      type: "varchar",
      isNullable: false
    }),
    new TableColumn({
      name: "isAdult",
      type: "tinyint",
      isNullable: false,
      default: false
    }),
    new TableColumn({
      name: "role",
      type: "varchar",
      isNullable: false
    }),
    new TableColumn({
      name: "graduationYear",
      type: "smallint",
      isNullable: true
    }),
    new TableColumn({
      name: "password",
      type: "varchar",
      isNullable: true
    })
  ]
});

const userChildrenJoinTable = new Table({
  name: "user_children_user",
  columns: [
    new TableColumn({
      name: "user_id_1",
      type: "varchar",
      isNullable: false,
      isPrimary: true
    }),
    new TableColumn({
      name: "user_id_2",
      type: "varchar",
      isNullable: false,
      isPrimary: true
    })
  ],
  foreignKeys: [
    new TableForeignKey({
      referencedTableName: "user",
      columnNames: ["user_id_1"],
      referencedColumnNames: ["_id"],
      onDelete: "CASCADE"
    }),
    new TableForeignKey({
      referencedTableName: "user",
      columnNames: ["user_id_2"],
      referencedColumnNames: ["_id"],
      onDelete: "CASCADE"
    })
  ]
});

export class Init1514764800000 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    await queryRunner.createTable(userTable, false, true);
    await queryRunner.createTable(userChildrenJoinTable, false, true);
    await queryRunner.createTable(entryTable, false, true);
    await queryRunner.createTable(slotTable, false, true);
  }

  async down(queryRunner: QueryRunner) {
    await queryRunner.dropTable(slotTable, false, true);
    await queryRunner.dropTable(entryTable, false, true);
    await queryRunner.dropTable(userChildrenJoinTable, false, true);
    await queryRunner.dropTable(userTable, false, true);
  }
}
