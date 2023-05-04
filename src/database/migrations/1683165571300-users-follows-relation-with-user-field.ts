import { MigrationInterface, QueryRunner } from 'typeorm';

export class usersFollowsRelationWithUserField1683165571300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_follows" ADD CONSTRAINT "FK_46b668c49a6c4134f4643d875a5" FOREIGN KEY ("followerId") REFERENCES "users_follows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_follows" ADD CONSTRAINT "FK_4959b4225f25d994761e54c7cs4" FOREIGN KEY ("followingId") REFERENCES "users_follows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users_follows" DROP CONSTRAINT "FK_46b668c49a6c4134f4643d875a5"`);
    await queryRunner.query(`ALTER TABLE "users_follows" DROP CONSTRAINT "FK_4959b4225f25d994761e54c7cs4"`);
    await queryRunner.query(`DROP TABLE "users_follows"`);
  }
}
