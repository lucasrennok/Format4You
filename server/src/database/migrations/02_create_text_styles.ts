import type { Knex } from 'knex';

// Estilo do texto (size em meios-pontos: 24 = 12pt)
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('text_styles', (table) => {
    table.increments('id').primary();
    table.integer('bold').notNullable();
    table.string('font').notNullable();
    table.integer('size').notNullable();
    table.integer('italics').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('text_styles');
}
