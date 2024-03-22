import { DataSourceOptions, DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

const {
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_URL,
} = process.env;
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url:
    DATABASE_URL ||
    `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:5432/${DATABASE_NAME}`,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/config/migrations/*.js'],
  migrationsRun: true,
};

export default new DataSource(dataSourceOptions);
