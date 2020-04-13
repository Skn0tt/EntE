import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

const transitionalNewDateColumn = new TableColumn({
  name: "date_new",
  type: "date",
  isNullable: true,
});

const finalNewDateColumn = new TableColumn({
  name: "date",
  type: "date",
  isNullable: false,
});

const transitionalNewDateEndColumn = new TableColumn({
  name: "dateEnd_new",
  type: "date",
  isNullable: true,
});

const transitionalOldDateColumn = new TableColumn({
  name: "date_new",
  type: "datetime",
  isNullable: true,
});

const finalOldDateColumn = new TableColumn({
  name: "date",
  type: "datetime",
  isNullable: false,
});

const transitionalOldDateEndColumn = new TableColumn({
  name: "dateEnd_new",
  type: "datetime",
  isNullable: true,
});

export class AlterEntryDatetimeColumnsToDate1545813658000
  implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    // `date`
    await queryRunner.addColumn("entry", transitionalNewDateColumn);

    await queryRunner.query("UPDATE `entry` SET `date_new` = DATE(`date`)");

    await queryRunner.dropColumn("entry", "date");
    await queryRunner.changeColumn(
      "entry",
      transitionalNewDateColumn,
      finalNewDateColumn
    );

    // `dateEnd`
    await queryRunner.addColumn("entry", transitionalNewDateEndColumn);

    await queryRunner.query(
      "UPDATE `entry` SET `dateEnd_new` = DATE(`dateEnd`) WHERE `dateEnd` IS NOT NULL"
    );

    await queryRunner.dropColumn("entry", "dateEnd");
    await queryRunner.renameColumn("entry", "dateEnd_new", "dateEnd");
  }

  async down(queryRunner: QueryRunner) {
    // `date`
    await queryRunner.addColumn("entry", transitionalOldDateColumn);

    await queryRunner.query("UPDATE `entry` SET `date_new` = DATETIME(`date`)");

    await queryRunner.dropColumn("entry", "date");
    await queryRunner.changeColumn(
      "entry",
      transitionalOldDateColumn,
      finalOldDateColumn
    );

    // `dateEnd`
    await queryRunner.addColumn("entry", transitionalOldDateEndColumn);

    await queryRunner.query(
      "UPDATE `entry` SET `dateEnd_new` = DATETIME(`dateEnd`) WHERE `dateEnd` IS NOT NULL"
    );

    await queryRunner.dropColumn("entry", "dateEnd");
    await queryRunner.renameColumn("entry", "dateEnd_new", "dateEnd");
  }
}
