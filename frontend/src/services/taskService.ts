import api from './api';
import {
  Task,
  CreateTaskDTO,
  UpdateTaskDTO,
  ApiResponse,
  TaskStats,
} from '../types';

/**
 * Servicio para manejar operaciones de tareas
 */
const taskService = {
  /**
   * Obtener todas las tareas
   */
  getAllTasks: async (filters?: {
    status?: string;
    priority?: string;
    category?: string;
  }): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.category) params.append('category', filters.category);

    const response = await api.get<ApiResponse<Task[]>>(
      `/tasks?${params.toString()}`
    );
    return response.data.data || [];
  },

  /**
   * Obtener una tarea por ID
   */
  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data!;
  },

  /**
   * Crear una nueva tarea
   */
  createTask: async (taskData: CreateTaskDTO): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>('/tasks', taskData);
    return response.data.data!;
  },

  /**
   * Actualizar una tarea
   */
  updateTask: async (id: string, taskData: UpdateTaskDTO): Promise<Task> => {
    const response = await api.put<ApiResponse<Task>>(
      `/tasks/${id}`,
      taskData
    );
    return response.data.data!;
  },

  /**
   * Eliminar una tarea
   */
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  /**
   * Obtener estadísticas de tareas
   */
  getTaskStats: async (): Promise<TaskStats> => {
    const response = await api.get<ApiResponse<TaskStats>>(
      '/tasks/stats/overview'
    );
    return response.data.data!;
  },
};

export default taskService;