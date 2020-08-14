import express from 'express';
import TemplatesCommandsController from './controllers/TemplatesCommandsController';

const routes = express.Router();
const templatesCommandsControllers = new TemplatesCommandsController();

routes.post('/template', templatesCommandsControllers.create);
routes.get('/template/commands', templatesCommandsControllers.getAllCommands);
routes.get('/template/command/formatstyle', templatesCommandsControllers.getCommandFormatStyle);
routes.get('/template/command/textstyle', templatesCommandsControllers.getCommandTextStyle);
routes.get('/template/command/type', templatesCommandsControllers.getCommandFromType);

export default routes;
