import type { Request, Response } from 'express';
import db from '../database/connection.js';

const asString = (value: unknown): string => (typeof value === 'string' ? value : '');

export default class TemplatesCommandsController {
  // Lista todos os comandos de um template
  async getAllCommands(request: Request, response: Response) {
    const template = asString(request.query.template);
    if (!template) return response.status(400).json({ error: 'Informe o template.' });

    const rows = await db('template_commands').where({ template }).select('command');
    return response.json({ allcommands: rows.map((row) => row.command) });
  }

  // Estilo de texto (negrito, fonte, tamanho, itálico) de um comando
  async getCommandTextStyle(request: Request, response: Response) {
    const template = asString(request.query.template);
    const command = asString(request.query.command);

    const textStyle = await db('template_commands')
      .where({ template, command })
      .join('text_styles', 'template_commands.text_styles_id', 'text_styles.id')
      .select('text_styles.bold', 'text_styles.font', 'text_styles.size', 'text_styles.italics')
      .first();

    if (!textStyle) return response.status(404).json({ error: 'Comando não encontrado.' });
    return response.json(textStyle);
  }

  // Formatação do parágrafo (alinhamento, espaçamento, recuo) de um comando
  async getCommandFormatStyle(request: Request, response: Response) {
    const template = asString(request.query.template);
    const command = asString(request.query.command);

    const row = await db('template_commands')
      .where({ template, command })
      .join('format_styles', 'template_commands.format_styles_id', 'format_styles.id')
      .join('indent', 'format_styles.indent_id', 'indent.id')
      .join('spacing', 'format_styles.spacing_id', 'spacing.id')
      .select(
        'format_styles.alignment',
        'indent.firstLine',
        'indent.hanging',
        'indent.left',
        'indent.right',
        'spacing.before',
        'spacing.after'
      )
      .first();

    if (!row) return response.status(404).json({ error: 'Comando não encontrado.' });

    return response.json({
      alignment: row.alignment,
      spacing: { before: row.before, after: row.after },
      indent: { firstLine: row.firstLine, hanging: row.hanging, left: row.left, right: row.right },
    });
  }

  // Comando associado a um tipo (image, table, caption, section...)
  async getCommandFromType(request: Request, response: Response) {
    const template = asString(request.query.template);
    const command_type = asString(request.query.commandtype);

    const row = await db('template_commands')
      .where({ template, command_type })
      .select('command')
      .first();

    if (!row) return response.status(404).json({ error: 'Tipo não encontrado.' });
    return response.json(row);
  }

  // Cria um comando com seus estilos (dentro de uma transação)
  async create(request: Request, response: Response) {
    const { template, command, command_type, format_styles, text_styles } = request.body ?? {};
    if (!template || !command || !command_type || !format_styles || !text_styles) {
      return response.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    await db.transaction(async (trx) => {
      const [spacing_id] = await trx('spacing').insert({
        before: format_styles.spacing.before,
        after: format_styles.spacing.after,
      });
      const [indent_id] = await trx('indent').insert({
        firstLine: format_styles.indent.firstLine,
        hanging: format_styles.indent.hanging,
        left: format_styles.indent.left,
        right: format_styles.indent.right,
      });
      const [format_styles_id] = await trx('format_styles').insert({
        alignment: format_styles.alignment,
        spacing_id,
        indent_id,
      });
      const [text_styles_id] = await trx('text_styles').insert({
        bold: text_styles.bold,
        font: text_styles.font,
        size: text_styles.size,
        italics: text_styles.italics,
      });
      await trx('template_commands').insert({
        template,
        command,
        command_type,
        text_styles_id,
        format_styles_id,
      });
    });

    return response.status(201).send();
  }
}
