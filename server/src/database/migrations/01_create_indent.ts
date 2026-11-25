import type { Knex } from 'knex';

// Recuos do parágrafo (em twips: 285 ≈ 0,5cm)
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('indent', (table) => {
    table.increments('id').primary();
    table.integer('firstLine').notNullable();
    table.integer('hanging').notNullable();
    table.integer('left').notNullable();
    table.integer('right').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('indent');
}
