import type { Knex } from 'knex';

// Espaçamento antes/depois do parágrafo (em twips: 120 = 6pt)
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('spacing', (table) => {
    table.increments('id').primary();
    table.integer('before').notNullable();
    table.integer('after').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('spacing');
}
