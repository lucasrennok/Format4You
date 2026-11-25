import { createApp } from './app.js';
import { env } from './config/env.js';
import db from './database/connection.js';

const server = createApp().listen(env.port, env.host, () => {
  console.log(`API de templates em http://${env.host}:${env.port}`);
});

async function shutdown(signal: string) {
  console.log(`\n${signal} recebido, encerrando...`);
  server.close(async () => {
    await db.destroy();
    process.exit(0);
  });
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
