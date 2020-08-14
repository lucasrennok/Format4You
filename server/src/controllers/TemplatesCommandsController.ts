import {Request, Response} from 'express';
import db from "../database/connections";

export default class TemplatesCommandsController{
    async getAllCommands(request: Request, response: Response){
        const {template} = request.query;

        const allCommandsSelect = await db('template_commands')
            .select('command')
            .where('template','=',template as string);
        
        let allCommandsVector = []
        
        for(let i=0; i<allCommandsSelect.length; i++){
            allCommandsVector[i] = allCommandsSelect[i].command;
        }

        return response.json({allcommands: allCommandsVector});
    }

    async getCommandTextStyle(request: Request, response: Response){
        const {template, command} = request.query;
        
        const textStyleOfCommand = await db('template_commands')
            .where('template','=', template as string)
            .where('command', '=', command as string)
            .join('text_styles', 'template_commands.text_styles_id', '=', 'text_styles.id')
            .select('text_styles.bold', 'text_styles.font', 'text_styles.size', 'text_styles.italics');

        return response.json(textStyleOfCommand[0]);
    }

    async getCommandFormatStyle(request: Request, response: Response){
        const {template, command} = request.query;
        
        const indentStyleOfCommand = await db('template_commands')
            .where('template','=', template as string)
            .where('command', '=', command as string)
            .join('format_styles', 'template_commands.format_styles_id', '=', 'format_styles.id')
            .join('indent', 'format_styles.indent_id', '=', 'indent.id')
            .select('indent.firstLine', 'indent.hanging', 'indent.left', 'indent.right');
        
        const spacingStyleOfCommand = await db('template_commands')
            .where('template','=', template as string)
            .where('command', '=', command as string)
            .join('format_styles', 'template_commands.format_styles_id', '=', 'format_styles.id')
            .join('spacing', 'format_styles.spacing_id', '=', 'spacing.id')
            .select('spacing.before', 'spacing.after');

        const alignmentStyleOfCommand = await db('template_commands')
            .where('template','=', template as string)
            .where('command', '=', command as string)
            .join('format_styles', 'template_commands.format_styles_id', '=', 'format_styles.id')
            .select('format_styles.alignment');
            
        return response.json({...alignmentStyleOfCommand[0],spacing: spacingStyleOfCommand[0], indent: indentStyleOfCommand[0]});
    }

    async getCommandFromType(request: Request, response: Response){
        const {template, commandtype} = request.query;

        const command = await db('template_commands')
            .where('template', '=', template as string)
            .where('command_type', '=', commandtype as string)
            .select('command')

        return response.json(command[0]);
    }

    async create(request: Request, response: Response){
        const {
            template,
            command,
            command_type,
            format_styles,
            text_styles,
        } = request.body;
    
        const trx = await db.transaction();
        try{
            const alignment = format_styles.alignment
            const before = format_styles.spacing.before
            const after = format_styles.spacing.after
            const firstLine = format_styles.indent.firstLine
            const hanging = format_styles.indent.hanging
            const left = format_styles.indent.left
            const right = format_styles.indent.right
    
            const insertedSpacings = await trx('spacing').insert({
                before,
                after,
            });
            const spacing_id = insertedSpacings[0];
            const insertedIndents = await trx('indent').insert({
                firstLine,
                hanging,
                left,
                right
            });
            const indent_id = insertedIndents[0];
            const insertedFormatStyles = await trx('format_styles').insert({
                alignment,
                spacing_id, //spacing foreign key
                indent_id, //indent foreign key
            });
            const format_styles_id = insertedFormatStyles[0];
    
            const bold = text_styles.bold
            const font = text_styles.font
            const size = text_styles.size
            const italics = text_styles.italics
    
            const insertedTextStyles = await trx('text_styles').insert({
                bold,
                font,
                size,
                italics
            });
            const text_styles_id = insertedTextStyles[0];
    
            await trx('template_commands').insert({
                template,
                command,
                command_type,
                text_styles_id, //format styles foreign key
                format_styles_id, //text styles foreign key
            });
            
            await trx.commit();
    
            return response.status(201).send();
        }catch(err){
            await trx.rollback();
    
            return response.status(400).json({
                error: "Unexpected error while creating the template command."
            })
        }
    }
}