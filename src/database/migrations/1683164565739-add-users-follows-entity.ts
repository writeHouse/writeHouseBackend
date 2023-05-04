import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUsersFollowsEntity1683164565739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
              -- Table Definition
              CREATE TABLE "users_follows" (
                "id" BIGSERIAL PRIMARY KEY,  
                "followerId" int8 NOT NULL,  
                "followingId" int8 NOT NULL,
                "followerAddress" VARCHAR,  
                "followingAddress" VARCHAR,  
                "createdAt" timestamptz NOT NULL DEFAULT now(),  
                "updatedAt" timestamptz NOT NULL DEFAULT now() 
              );
          `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users_follows";', undefined);
  }
}
