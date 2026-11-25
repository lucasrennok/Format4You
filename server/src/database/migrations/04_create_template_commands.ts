import type { Knex } from 'knex';

// Comando de um template (ex.: #title:) e para onde ele aponta
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('template_commands', (table) => {
    table.string('template').notNullable();
    table.string('command').notNullable();
    table.string('command_type').notNullable(); // title, text, caption, section...

    table.primary(['template', 'command']);

    table
      .integer('text_styles_id')
      .notNullable()
      .references('id')
      .inTable('text_styles')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');

    table
      .integer('format_styles_id')
      .notNullable()
      .references('id')
      .inTable('format_styles')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('template_commands');
}
