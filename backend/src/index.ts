import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase, setupDatabaseEvents } from './config/database';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware';

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app: Application = express();

// Puerto del servidor
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Task Manager API is running! 🚀',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks',
      auth: '/api/auth',
    },
  });
});

// Ruta de health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected',
  });
});

// ⬇️ AGREGAR ESTA RUTA TEMPORAL DE PRUEBA ⬇️
import Task from './models/Task';
import User from './models/User';
import { TaskStatus, TaskPriority } from './types';

app.get('/api/test-models', async (req: Request, res: Response) => {
  try {
    // 1. Crear un usuario de prueba
    const testUser = await User.create({
      email: 'test@example.com',
      password: 'test123456', // En producción esto estaría hasheado
      name: 'Test User',
    });

    console.log('✅ User created:', testUser);

    // 2. Crear una tarea de prueba
    const testTask = await Task.create({
      title: 'Mi primera tarea',
      description: 'Esta es una tarea de prueba para verificar el modelo',
      status: TaskStatus.PENDING,
      priority: TaskPriority.HIGH,
      userId: testUser._id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días desde ahora
    });

    console.log('✅ Task created:', testTask);

    // 3. Buscar la tarea
    const foundTask = await Task.findById(testTask._id);

    res.json({
      success: true,
      message: 'Models tested successfully!',
      data: {
        user: testUser,
        task: foundTask,
      },
    });
  } catch (error: any) {
    console.error('❌ Error testing models:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing models',
      error: error.message,
    });
  }
});
// ⬆️ FIN DE LA RUTA DE PRUEBA ⬆️

// Ruta para limpiar datos de prueba
app.delete('/api/test-cleanup', async (req: Request, res: Response) => {
  try {
    await User.deleteMany({ email: 'test@example.com' });
    await Task.deleteMany({});
    
    res.json({
      success: true,
      message: 'Test data cleaned up successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error cleaning up',
      error: error.message,
    });
  }
});

// Middleware para rutas no encontradas (debe ir después de todas las rutas)
app.use(notFoundMiddleware);

// Middleware de manejo de errores (debe ser el último)
app.use(errorMiddleware);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // 1. Conectar a la base de datos
    await connectDatabase();
    
    // 2. Configurar eventos de la base de datos
    setupDatabaseEvents();

    // 3. Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      console.log('🎯 Press CTRL+C to stop the server');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();

