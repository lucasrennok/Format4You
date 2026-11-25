import type { Knex } from 'knex';
import { env } from './src/config/env.js';

const config: Knex.Config = {
  client: 'better-sqlite3',
  connection: { filename: env.databasePath },
  useNullAsDefault: true,
  migrations: { directory: env.migrationsDir, extension: 'ts' },
  seeds: { directory: env.seedsDir, extension: 'ts' },
};

export default config;
