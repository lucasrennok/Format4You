import knex from 'knex';
import { env } from '../config/env.js';

const db = knex({
  client: 'better-sqlite3',
  connection: { filename: env.databasePath },
  useNullAsDefault: true,
  migrations: { directory: env.migrationsDir, loadExtensions: ['.ts', '.js'] },
  seeds: { directory: env.seedsDir, loadExtensions: ['.ts', '.js'] },
  pool: {
    // garante que as foreign keys do SQLite sejam respeitadas
    afterCreate: (conn: { pragma: (s: string) => void }, done: (err?: Error) => void) => {
      conn.pragma('foreign_keys = ON');
      done();
    },
  },
});

export default db;
