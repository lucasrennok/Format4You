import express from 'express';
import db from './database/connections';

const routes = express.Router();

routes.post('/test', async (request, response) => {
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

        return response.send();
    }catch(err){
        return response.status(400).json({
            error: "Unexpected error while creating the template command."
        })
    }
});

export default routes;
