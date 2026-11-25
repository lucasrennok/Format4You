import type { Request, Response } from 'express';
import db from '../database/connection.js';

export default class TemplatesMarginsController {
  // Margens de um template
  async getMargins(request: Request, response: Response) {
    const template = typeof request.query.template === 'string' ? request.query.template : '';
    if (!template) return response.status(400).json({ error: 'Informe o template.' });

    const margins = await db('template_margins')
      .where({ template })
      .select('top', 'right', 'bottom', 'left')
      .first();

    if (!margins) return response.status(404).json({ error: 'Template não encontrado.' });
    return response.json(margins);
  }

  // Cria as margens de um template
  async create(request: Request, response: Response) {
    const { template, top, right, bottom, left } = request.body ?? {};
    if (!template) return response.status(400).json({ error: 'Informe o template.' });

    await db('template_margins').insert({ template, top, right, bottom, left });
    return response.status(201).send();
  }
}
