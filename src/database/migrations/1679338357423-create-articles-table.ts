import { MigrationInterface, QueryRunner } from 'typeorm';

export class createArticlesTable1679338357423 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
              -- Table Definition
              CREATE TABLE "articles" (
                  "id" BIGSERIAL PRIMARY KEY,
                  "baseID" varchar NOT NULL,
                  "tokenID" int8,
                  "ownerAddress" varchar NOT NULL,
                  "ownerId" int8,
                  "authorAddress" varchar NOT NULL,
                  "authorId" int8,
                  "title" varchar NOT NULL,
                  "title_search" varchar,
                  "description" text NOT NULL,
                  "description_search" text,
                  "publicationId" int8,
                  "listed" bool DEFAULT false,
                  "listedOnChain" bool DEFAULT false,
                  "categories" varchar[],
                  "imageUrl" varchar,
                  "thumbnailUrl" varchar,
                  "transactionHash" varchar,
                  "price" float8,
                  "priority" int4,
                  "status" varchar,
                  "chain" varchar DEFAULT 'bsc',                 
                  "createdAt" timestamptz NOT NULL DEFAULT now(),
                  "updatedAt" timestamptz NOT NULL DEFAULT now()
              );
          `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "articles";', undefined);
  }
}
