import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('text_styles', table => {
        table.increments('id').primary();
        table.integer('bold').notNullable();
        table.string('font').notNullable();
        table.integer('size').notNullable();
        table.integer('italics').notNullable();
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('text_styles');
}