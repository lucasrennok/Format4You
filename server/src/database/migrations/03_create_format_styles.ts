import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('format_styles', table => {
        table.increments('id').primary();
        table.string('alignment').notNullable();

        table.integer('spacing_id')
            .notNullable()
            .references('id')
            .inTable('spacing')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');

        table.integer('indent_id')
            .notNullable()
            .references('id')
            .inTable('indent')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('format_styles');
}