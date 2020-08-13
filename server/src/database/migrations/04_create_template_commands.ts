import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('template_commands', table => {
        table.string('template').notNullable(); //template name
        table.string('command').notNullable();  // #somethinghere: or something different
        table.string('command_type').notNullable(); // title, normal text, references, section...

        table.primary(['template','command']);

        table.integer('text_styles_id')
            .notNullable()
            .references('id')
            .inTable('text_styles')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');

        table.integer('format_styles_id')
            .notNullable()
            .references('id')
            .inTable('format_styles')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');

    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('template_commands');
}