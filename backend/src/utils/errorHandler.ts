import { Response } from 'express';

/**
 * Clase personalizada para errores de la aplicación
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Errores que son esperados vs bugs

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Maneja errores y envía respuesta apropiada
 */
export const handleError = (error: any, res: Response): void => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    // Errores operacionales (esperados)
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  } else if (error.name === 'ValidationError') {
    // Errores de validación de Mongoose
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.errors,
    });
  } else if (error.code === 11000) {
    // Error de duplicado en MongoDB
    res.status(409).json({
      success: false,
      message: 'Duplicate field value',
    });
  } else {
    // Errores no esperados
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Wrapper para funciones async en Express
 * Evita tener que escribir try-catch en cada controlador
 */
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};