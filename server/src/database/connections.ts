import knex from 'knex';
import path from 'path';

const db = knex({
    client: 'sqlite3',
    connection: {
        filname: path.resolve(__dirname, 'database.sqlite'),
    },
    useNullAsDefault: true,
});

export default db;