import type { Knex } from 'knex';

const TEMPLATE = 'sbc';

type Align = 'both' | 'center' | 'start' | 'end';

interface CommandSpec {
  command: string;
  command_type: string;
  align: Align;
  bold?: boolean;
  italics?: boolean;
  size?: number; // em pontos
  before?: number; // twips
  after?: number;
  firstLine?: number;
  hanging?: number;
}

// Template padrão parecido com o modelo SBC. Medidas em twips (1/20 pt);
// tamanho de fonte em pontos (convertido para meios-pontos ao inserir).
const COMMANDS: CommandSpec[] = [
  { command: '#title:', command_type: 'title', align: 'center', bold: true, size: 16, after: 240 },
  { command: '#author:', command_type: 'author', align: 'center', size: 12, after: 60 },
  { command: '#institute:', command_type: 'institute', align: 'center', size: 11 },
  { command: '#email:', command_type: 'email', align: 'center', italics: true, size: 11, after: 180 },
  { command: '#abstract:', command_type: 'abstract', align: 'both', size: 10, after: 120 },
  { command: '#resumo:', command_type: 'resumo', align: 'both', size: 10, after: 180 },
  { command: '#section:', command_type: 'section', align: 'start', bold: true, size: 12, before: 240, after: 120 },
  { command: '#subsec:', command_type: 'subsection', align: 'start', bold: true, size: 11, before: 160, after: 80 },
  { command: '#text:', command_type: 'text', align: 'both', size: 12, firstLine: 425 },
  { command: '#caption:', command_type: 'caption', align: 'center', size: 10, before: 60, after: 120 },
  { command: '#caption-justified:', command_type: 'bigcaption', align: 'both', size: 10, before: 60, after: 120 },
  { command: '#table-title:', command_type: 'tabletitle', align: 'center', size: 10, before: 120, after: 60 },
  { command: '#table-title-justified:', command_type: 'bigtabletitle', align: 'both', size: 10, before: 120, after: 60 },
  { command: '#img:', command_type: 'image', align: 'center', size: 12 },
  { command: '#table:', command_type: 'table', align: 'center', size: 12 },
  { command: '#ref:', command_type: 'references', align: 'start', size: 12, hanging: 425, after: 80 },
];

export async function seed(knex: Knex): Promise<void> {
  // Limpa apenas o que pertence a este template (idempotente)
  await knex('template_commands').where({ template: TEMPLATE }).del();
  await knex('template_margins').where({ template: TEMPLATE }).del();
  // tabelas de estilo são compartilhadas; recriadas do zero a cada seed
  await knex('format_styles').del();
  await knex('text_styles').del();
  await knex('spacing').del();
  await knex('indent').del();

  for (const spec of COMMANDS) {
    const [spacing_id] = await knex('spacing').insert({
      before: spec.before ?? 0,
      after: spec.after ?? 0,
    });
    const [indent_id] = await knex('indent').insert({
      firstLine: spec.firstLine ?? 0,
      hanging: spec.hanging ?? 0,
      left: 0,
      right: 0,
    });
    const [format_styles_id] = await knex('format_styles').insert({
      alignment: spec.align,
      spacing_id,
      indent_id,
    });
    const [text_styles_id] = await knex('text_styles').insert({
      bold: spec.bold ? 1 : 0,
      font: 'Times New Roman',
      size: (spec.size ?? 12) * 2, // pontos -> meios-pontos
      italics: spec.italics ? 1 : 0,
    });
    await knex('template_commands').insert({
      template: TEMPLATE,
      command: spec.command,
      command_type: spec.command_type,
      text_styles_id,
      format_styles_id,
    });
  }

  // Margens A4 padrão ~2,5cm (1417 twips)
  await knex('template_margins').insert({
    template: TEMPLATE,
    top: 1417,
    right: 1417,
    bottom: 1417,
    left: 1417,
  });
}
