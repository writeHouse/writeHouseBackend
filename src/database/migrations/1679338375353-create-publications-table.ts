import { MigrationInterface, QueryRunner } from 'typeorm';

export class createPublicationsTable1679338375353 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
              -- Table Definition
              CREATE TABLE "publications" (
                  "id" BIGSERIAL PRIMARY KEY,
                  "slug" varchar NOT NULL,
                  "creatorId" int8,
                  "transactionHash" varchar,
                  "creatorAddress" varchar,
                  "title" varchar NOT NULL,
                  "description" varchar,
                  "imageUrl" varchar,
                  "imageUrlThumbnail" varchar,
                  "published" boolean DEFAULT false,
                  "active" boolean DEFAULT false,
                  "priority" int4 DEFAULT 1,
                  "chain" varchar DEFAULT 'bsc', 
                  "createdAt" timestamptz NOT NULL DEFAULT now(),
                  "updatedAt" timestamptz NOT NULL DEFAULT now()
              );
          `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "publications";', undefined);
  }
}
