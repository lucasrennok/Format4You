import 'dotenv/config';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '..');

export const env = {
  port: Number(process.env.PORT) || 3333,
  host: process.env.HOST || '0.0.0.0',
  corsOrigin: (() => {
    const raw = process.env.CORS_ORIGIN?.trim();
    if (!raw || raw === '*') return '*' as const;
    return raw.split(',').map((o) => o.trim());
  })(),
  databasePath:
    process.env.DATABASE_PATH ?? path.resolve(root, 'src', 'database', 'database.sqlite'),
  migrationsDir: path.resolve(root, 'src', 'database', 'migrations'),
  seedsDir: path.resolve(root, 'src', 'database', 'seeds'),
};
