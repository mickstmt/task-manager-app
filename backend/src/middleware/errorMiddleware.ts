import { Request, Response, NextFunction } from 'express';
import { handleError } from '../utils/errorHandler';

/**
 * Middleware para manejar errores globalmente
 */
export const errorMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  handleError(error, res);
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};