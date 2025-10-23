import mongoose, { Schema, Document } from 'mongoose';
import { TaskStatus, TaskPriority } from '../types';

/**
 * Interface que define la estructura de un Task en TypeScript
 */
export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  category?: string;
  userId: mongoose.Types.ObjectId; // Referencia al usuario dueño de la tarea
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema de Mongoose que define la estructura en MongoDB
 */
const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true, // Elimina espacios al inicio y final
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus), // Solo permite los valores del enum
      default: TaskStatus.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          // La fecha debe ser futura (solo si se proporciona)
          return !value || value > new Date();
        },
        message: 'Due date must be in the future',
      },
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Referencia al modelo User (lo crearemos después)
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
  }
);

/**
 * Índices para mejorar el rendimiento de las consultas
 */
TaskSchema.index({ userId: 1, status: 1 }); // Índice compuesto
TaskSchema.index({ userId: 1, createdAt: -1 }); // Para ordenar por fecha
TaskSchema.index({ dueDate: 1 }); // Para buscar por fecha de vencimiento

/**
 * Métodos virtuales (campos calculados que no se guardan en la DB)
 */
TaskSchema.virtual('isOverdue').get(function (this: ITask) {
  if (!this.dueDate) return false;
  return this.dueDate < new Date() && this.status !== TaskStatus.COMPLETED;
});

/**
 * Método de instancia: Marcar tarea como completada
 */
TaskSchema.methods.markAsCompleted = function () {
  this.status = TaskStatus.COMPLETED;
  return this.save();
};

/**
 * Método estático: Obtener estadísticas de tareas de un usuario
 */
TaskSchema.statics.getTaskStats = async function (userId: string) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  return stats;
};

// Exportar el modelo
export default mongoose.model<ITask>('Task', TaskSchema);