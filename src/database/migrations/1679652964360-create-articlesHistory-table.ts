import { MigrationInterface, QueryRunner } from 'typeorm';

export class createArticlesHistoryTable1679652964360 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            -- Table Definition
            CREATE TABLE "articles_history" (
              "id" BIGSERIAL PRIMARY KEY,
              "articleId" int8,
              "tokenId" int8,
              "actorId" int8,
              "actorAddress" VARCHAR,
              "receiverId" int8,
              "receiverAddress" VARCHAR,
              "type" VARCHAR NOT NULL,
              "action" VARCHAR,
              "payload" TEXT,
              "transactionHash" VARCHAR,
              "currentPrice" float8,
              "newPrice" float8,
              "chain" varchar DEFAULT 'bsc',
              "createdAt" timestamptz NOT NULL DEFAULT now(),
              "updatedAt" timestamptz NOT NULL DEFAULT now()
            );
          `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "articles_history";', undefined);
  }
}
