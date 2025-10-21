import { Request } from 'express';

/**
 * Enums para valores predefinidos
 */
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Interface extendida de Request para incluir usuario autenticado
 * (la usaremos más adelante cuando implementemos autenticación)
 */
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Response types para APIs
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}