import { AppDataSource } from '../../../typorm.config';

// init data source
export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
      .then(() => {
        console.log('Database connected');
      })
      .catch((error) => {
        console.error('Error connecting to database:', error);
      });
  }
  return AppDataSource;
}
