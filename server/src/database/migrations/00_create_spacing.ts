import Knex from 'knex';

export async function up(knex: Knex){
    return knex.schema.createTable('spacing', table => {
        table.increments('id').primary();
        table.integer('before').notNullable();
        table.integer('after').notNullable();
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('spacing');
}

//text_styles = data to format OK
    // bold: 1,
    // font: "Times",
    // size: 32, // 32 = 16 size
    // italics: 0,

//indent = data to indent
    // firstLine: 0,
    // hanging: 285, // 285 = 0,5cm
    // left: 285, // 285 = 0,5cm
    // right: 0,

//spacing = data to space the paragraph
    // before: 120, // 120 = 6pt
    // after: 0, 

//format_styles = data to format and foreign keys to indent and spacing OK
    // alignment: AlignmentType.JUSTIFIED,
    // spacingFK
    // indentFK

//template_commands = command_name and foreign keys to text_styles and format_styles
    // command_name + template_name = pk
    // command_type (example: title, normal_text, caption)
    // text_stylesFK
    // format_stylesFK
