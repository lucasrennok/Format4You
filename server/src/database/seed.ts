// Popula o template padrão (SBC). Rode com: npm run seed
import db from './connection.js';

await db.seed.run();
console.log('Seeds aplicados.');
await db.destroy();
