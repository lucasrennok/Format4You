import express from 'express';
import TemplatesCommandsController from './controllers/TemplatesCommandsController';
import TemplatesMarginsController from './controllers/TemplatesMarginsController'

const routes = express.Router();
const templatesCommandsControllers = new TemplatesCommandsController();
const templatesMarginsControllers = new TemplatesMarginsController();

routes.post('/template', templatesCommandsControllers.create);

routes.get('/template/margins', templatesMarginsControllers.getMargins);
routes.post('/template/margins', templatesMarginsControllers.create);

routes.get('/template/commands', templatesCommandsControllers.getAllCommands);
routes.get('/template/command/formatstyle', templatesCommandsControllers.getCommandFormatStyle);
routes.get('/template/command/textstyle', templatesCommandsControllers.getCommandTextStyle);
routes.get('/template/command/type', templatesCommandsControllers.getCommandFromType);

export default routes;
