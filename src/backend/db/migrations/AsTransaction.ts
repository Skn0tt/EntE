import { MigrationInterface, QueryRunner } from "typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";

async function inTransaction(
  queryRunner: QueryRunner,
  isolationLevel: IsolationLevel | undefined,
  query: (qr: QueryRunner) => Promise<void>
) {
  if (queryRunner.isTransactionActive) {
    await queryRunner.rollbackTransaction();
  }
  try {
    await queryRunner.startTransaction(isolationLevel);

    await query(queryRunner);

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error(error);
    throw error;
  }
}

export function TransactionMigration(isolationLevel?: IsolationLevel) {
  return function <T extends { new (): MigrationInterface }>(
    constructor: T
  ): T {
    const _class = class TransactionMigrationDecorator
      implements MigrationInterface {
      readonly name?: string | undefined;
      private readonly migration: MigrationInterface;

      constructor() {
        this.migration = new constructor();
        this.name = this.migration.name;
      }

      async up(queryRunner: QueryRunner) {
        await inTransaction(queryRunner, isolationLevel, (qr) =>
          this.migration.up(qr)
        );
      }

      async down(queryRunner: QueryRunner) {
        await inTransaction(queryRunner, isolationLevel, (qr) =>
          this.migration.down(qr)
        );
      }
    };

    return (_class as unknown) as T;
  };
}
