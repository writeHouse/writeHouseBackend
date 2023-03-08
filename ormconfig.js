require('dotenv').config();

module.exports = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 3306,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/**/*.entity{ .ts,.js}'],
  synchronize: false,
  migrations: ['src/database/migrations/*{.ts,.js}'],
  migrationsTableName: 'TypeormMigrations',
  migrationsRun: true,
};
