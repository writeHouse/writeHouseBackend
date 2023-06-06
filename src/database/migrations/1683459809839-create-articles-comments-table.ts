import { MigrationInterface, QueryRunner } from 'typeorm';

export class createArticlesCommentsTable1683459809839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        -- Table Definition
        CREATE TABLE "articles_comments" (
            "id" BIGSERIAL PRIMARY KEY,
            "body" varchar NOT NULL,
            "authorId" int8 NOT NULL,
            "authorAddress" varchar NOT NULL,
            "active" bool DEFAULT true,
            "articleId" varchar NOT NULL,
            "createdAt" timestamptz NOT NULL DEFAULT now(),
            "updatedAt" timestamptz NOT NULL DEFAULT now()
        );
    `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "articles_comments";', undefined);
  }
}
