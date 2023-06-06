import { MigrationInterface, QueryRunner } from 'typeorm';

export class createEventLogTable1686044398860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
                  -- Table Definition
                  CREATE TABLE "events_logs" (
                    "id" BIGSERIAL PRIMARY KEY,
                    "userId" int8,
                    "articleId" int8,
                    "publicationId" int8,
                    "type" VARCHAR NOT NULL,
                    "triggerAddress" VARCHAR,
                    "transactionHash" VARCHAR NOT NULL UNIQUE,
                    "data" TEXT,
                    "createdAt" timestamptz NOT NULL DEFAULT now(),
                    "updatedAt" timestamptz NOT NULL DEFAULT now()
                  );
                `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "events_logs";', undefined);
  }
}
