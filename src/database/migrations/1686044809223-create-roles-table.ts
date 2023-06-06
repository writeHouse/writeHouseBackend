import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRolesTable1686044809223 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        -- Table Definition
            CREATE TABLE "roles" (
                "id" BIGSERIAL PRIMARY KEY,
                "name" varchar UNIQUE NOT NULL,
                "description" VARCHAR,
                "createdAt" timestamptz NOT NULL DEFAULT now(),
                "updatedAt" timestamptz NOT NULL DEFAULT now()
            );
        `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "roles";', undefined);
  }
}
