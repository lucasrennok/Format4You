import type { Knex } from 'knex';

// Margens da página por template (em twips)
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('template_margins', (table) => {
    table.string('template').primary();
    table.integer('top').notNullable();
    table.integer('right').notNullable();
    table.integer('bottom').notNullable();
    table.integer('left').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('template_margins');
}
