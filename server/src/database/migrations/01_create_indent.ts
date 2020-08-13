import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('indent', table => {
        table.increments('id').primary();
        table.integer('firstLine').notNullable();
        table.integer('hanging').notNullable();
        table.integer('left').notNullable();
        table.integer('right').notNullable();
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('indent');
}