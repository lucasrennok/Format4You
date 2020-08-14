import express from 'express';
import TemplatesCommandsController from './controllers/TemplatesCommandsController';

const routes = express.Router();
const templatesCommandsControllers = new TemplatesCommandsController();

routes.post('/template', templatesCommandsControllers.create);
routes.get('/template/commands', templatesCommandsControllers.getAllCommands);
routes.get('/template/formatstyle', templatesCommandsControllers.getCommandFormatStyle);
routes.get('/template/textstyle', templatesCommandsControllers.getCommandTextStyle);

export default routes;
