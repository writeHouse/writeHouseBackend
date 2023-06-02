import { MigrationInterface, QueryRunner } from 'typeorm';

export class twoSearchColumnsInPublicationsTable1685117393990 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE publications ADD COLUMN "title_search" varchar;`);
    await queryRunner.query(`ALTER TABLE publications ADD COLUMN "description_search" varchar;`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE articles DROP COLUMN "title_search";`);
    await queryRunner.query(`ALTER TABLE articles DROP COLUMN "description_search";`);
  }
}
