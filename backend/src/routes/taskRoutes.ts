import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/taskController';

const router = express.Router();

/**
 * Rutas de Tasks
 */

// GET /api/tasks/stats/overview - DEBE IR ANTES de /:id
router.get('/stats/overview', getTaskStats);

// POST /api/tasks
router.post('/', createTask);

// GET /api/tasks
router.get('/', getAllTasks);

// GET /api/tasks/:id
router.get('/:id', getTaskById);

// PUT /api/tasks/:id
router.put('/:id', updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', deleteTask);

export default router;