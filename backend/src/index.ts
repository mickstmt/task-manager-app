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
    database: 'connected', // Podrías verificar el estado real aquí
  });
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