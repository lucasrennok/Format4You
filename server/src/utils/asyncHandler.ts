import type { NextFunction, Request, Response } from 'express';

// Encaminha erros de handlers async para o middleware de erro do Express.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
