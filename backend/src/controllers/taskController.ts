import { Request, Response } from 'express';
import Task from '../models/Task';
import { CreateTaskDTO, UpdateTaskDTO } from '../types';
import { AppError } from '../utils/errorHandler';

/**
 * @desc    Crear una nueva tarea
 * @route   POST /api/tasks
 * @access  Private (por ahora usaremos un userId de prueba)
 */
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskData: CreateTaskDTO = req.body;

    // Por ahora usamos un userId hardcodeado (lo cambiaremos en autenticación)
    // En producción, esto vendrá del token JWT
    const userId = '000000000000000000000000'; // ID temporal

    // Validar que los campos requeridos estén presentes
    if (!taskData.title || !taskData.description) {
      throw new AppError('Title and description are required', 400);
    }

    // Crear la tarea
    const task = await Task.create({
      ...taskData,
      userId,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error: any) {
    console.error('Error in createTask:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error creating task',
    });
  }
};

/**
 * @desc    Obtener todas las tareas
 * @route   GET /api/tasks
 * @access  Private
 */
export const getAllTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = '000000000000000000000000'; // Temporal

    // Query parameters para filtrado (opcional)
    const { status, priority, category } = req.query;

    // Construir el filtro dinámicamente
    const filter: any = { userId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    // Buscar tareas con filtros y ordenar por fecha de creación (más recientes primero)
    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error: any) {
    console.error('Error in getAllTasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
    });
  }
};

/**
 * @desc    Obtener una tarea por ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = '000000000000000000000000'; // Temporal

    const task = await Task.findOne({ _id: id, userId });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error: any) {
    console.error('Error in getTaskById:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error fetching task',
    });
  }
};

/**
 * @desc    Actualizar una tarea
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = '000000000000000000000000'; // Temporal
    const updateData: UpdateTaskDTO = req.body;

    // Buscar y actualizar la tarea
    const task = await Task.findOneAndUpdate(
      { _id: id, userId }, // Solo actualiza si pertenece al usuario
      updateData,
      {
        new: true, // Retorna el documento actualizado
        runValidators: true, // Ejecuta las validaciones del schema
      }
    );

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task,
    });
  } catch (error: any) {
    console.error('Error in updateTask:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error updating task',
    });
  }
};

/**
 * @desc    Eliminar una tarea
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = '000000000000000000000000'; // Temporal

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task,
    });
  } catch (error: any) {
    console.error('Error in deleteTask:', error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Error deleting task',
    });
  }
};

/**
 * @desc    Obtener estadísticas de tareas
 * @route   GET /api/tasks/stats/overview
 * @access  Private
 */
export const getTaskStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = '000000000000000000000000'; // Temporal

    // Usar el método estático que definimos en el modelo
    const stats = await Task.aggregate([
      { $match: { userId: userId as any } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Contar tareas por prioridad
    const priorityStats = await Task.aggregate([
      { $match: { userId: userId as any } },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Total de tareas
    const total = await Task.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: stats,
        byPriority: priorityStats,
      },
    });
  } catch (error: any) {
    console.error('Error in getTaskStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task statistics',
    });
  }
};