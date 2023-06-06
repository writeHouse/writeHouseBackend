import { MigrationInterface, QueryRunner } from 'typeorm';

const roles = ['Admin', 'Ambassador'];

export class addRolesSeeder1686044853498 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO roles (name) VALUES ${roles.map((role: string) => `('${role}')`).join(', ')}
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM roles where name IN ('${roles.join("', '")}')
  `);
  }
}
