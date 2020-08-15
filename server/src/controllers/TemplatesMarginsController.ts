import {Request, Response} from 'express';
import db from "../database/connections";

export default class TemplatesMarginsController{

    async getMargins(request: Request, response: Response){
        const {template} = request.query;

        const templateMargins = await db('template_margins')
            .where('template', '=', template as string)
            .select('template_margins.top','template_margins.right','template_margins.bottom','template_margins.left');

        return response.json(templateMargins[0]);
    }

    async create(request: Request, response: Response){
        const {
            template,
            top,
            right,
            bottom,
            left
        } = request.body;
    
        const trx = await db.transaction();
        try{
            await trx('template_margins').insert({
                template,
                top,
                right,
                bottom,
                left
            });
            
            await trx.commit();
    
            return response.status(201).send();
        }catch(err){
            await trx.rollback();
    
            return response.status(400).json({
                error: "Unexpected error while creating the template margin."
            })
        }
    }
}