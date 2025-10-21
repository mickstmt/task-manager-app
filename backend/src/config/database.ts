import mongoose from 'mongoose';

/**
 * Conecta la aplicación a MongoDB
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Opciones de conexión
    const options = {
      // Estas opciones son las recomendadas actualmente
      retryWrites: true,
      w: 'majority' as const,
    };

    // Conectar a MongoDB
    await mongoose.connect(mongoURI, options);

    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // En caso de error, terminamos el proceso
    process.exit(1);
  }
};

/**
 * Maneja eventos de la conexión a MongoDB
 */
export const setupDatabaseEvents = (): void => {
  // Cuando se desconecta
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  // Cuando hay un error después de conectar
  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB error:', error);
  });

  // Cuando se reconecta
  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
  });

  // Para cerrar la conexión correctamente cuando la app se cierra
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed through app termination');
    process.exit(0);
  });
};