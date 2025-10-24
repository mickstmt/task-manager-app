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
 * Interface para Task
 */
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  category?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTOs para crear/actualizar tareas
 */
export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  category?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  category?: string;
}

/**
 * Response de la API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

/**
 * Estadísticas de tareas
 */
export interface TaskStats {
  total: number;
  byStatus: Array<{
    _id: string;
    count: number;
  }>;
  byPriority: Array<{
    _id: string;
    count: number;
  }>;
}