import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('template_margins', table => {
        table.string('template').primary(); //template name

        table.integer('top').notNullable();
        table.integer('right').notNullable();
        table.integer('bottom').notNullable();
        table.integer('left').notNullable();
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('template_margins');
}