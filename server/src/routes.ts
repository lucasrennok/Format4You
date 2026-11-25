import { Router } from 'express';
import TemplatesCommandsController from './controllers/TemplatesCommandsController.js';
import TemplatesMarginsController from './controllers/TemplatesMarginsController.js';
import { asyncHandler } from './utils/asyncHandler.js';

const routes = Router();
const commands = new TemplatesCommandsController();
const margins = new TemplatesMarginsController();

routes.post('/template', asyncHandler(commands.create));

routes.get('/template/margins', asyncHandler(margins.getMargins));
routes.post('/template/margins', asyncHandler(margins.create));

routes.get('/template/commands', asyncHandler(commands.getAllCommands));
routes.get('/template/command/formatstyle', asyncHandler(commands.getCommandFormatStyle));
routes.get('/template/command/textstyle', asyncHandler(commands.getCommandTextStyle));
routes.get('/template/command/type', asyncHandler(commands.getCommandFromType));

export default routes;
