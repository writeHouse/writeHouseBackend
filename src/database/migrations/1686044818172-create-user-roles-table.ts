import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUserRolesTable1686044818172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
         -- Table Definition
                CREATE TABLE "users_roles" (
                "id" BIGSERIAL PRIMARY KEY,
                "userId" int8 NOT NULL,
                "roleId" int8 NOT NULL,
                "createdAt" timestamptz NOT NULL DEFAULT now(),
                "updatedAt" timestamptz NOT NULL DEFAULT now()
                );
    `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users_roles";', undefined);
  }
}
