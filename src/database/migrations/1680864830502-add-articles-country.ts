import {MigrationInterface, QueryRunner} from 'typeorm';

export class addArticlesCountry1680864830502 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE articles ADD COLUMN "country" varchar;`);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE articles DROP COLUMN "country";`);
    }
}