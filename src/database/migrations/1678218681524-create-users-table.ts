import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUsersTable1678218681524 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            -- Table Definition
            CREATE TABLE "users" (
              "id" BIGSERIAL PRIMARY KEY,
              "walletAddress" varchar NOT NULL UNIQUE,
              "username" varchar,
              "email" varchar,
              "fullName" varchar,
              "avatarUrl" varchar,
              "avatarUrlThumbnail" varchar,
              "coverUrl" varchar,
              "coverUrlThumbnail" varchar,
              "userBio" varchar,
              "linkedinUrl" varchar,
              "twitterUrl" varchar,
              "socialUrl" varchar,
              "buysTotalAmount" float8 DEFAULT 0.0,
              "salesTotalAmount" float8 DEFAULT 0.0,
              "buysCount" int4 DEFAULT 0,
              "salesCount" int4 DEFAULT 0,
              "createdCount" int4 DEFAULT 0,
              "followerCount" int4 DEFAULT 0,
              "followingCount" int4 DEFAULT 0,
              "hasAcceptedTerms" bool DEFAULT false,
              "banned" bool DEFAULT false,
              "canCreatePublication" bool DEFAULT true,
              "leaderboard" bool DEFAULT true,
              "verified" bool DEFAULT false,
              "notAllowedToPost" bool DEFAULT false,
              "status" varchar DEFAULT 'active',
              "username_search" varchar,
              "fullName_search" varchar,
              "keywords_search" varchar,
              "createdAt" timestamptz NOT NULL DEFAULT now(),
              "updatedAt" timestamptz NOT NULL DEFAULT now()
            );
          `,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "users";', undefined);
  }
}
