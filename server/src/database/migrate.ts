// Executa as migrations (cria as tabelas). Rode com: npm run migrate
import db from './connection.js';

const [batch, log] = await db.migrate.latest();
if (log.length === 0) {
  console.log('Banco já estava atualizado.');
} else {
  console.log(`Batch ${batch} aplicado:\n- ${log.join('\n- ')}`);
}
await db.destroy();
