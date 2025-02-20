import { AppDataSource } from './typeorm.config';

// init data source
/*
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
*/

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log(
      `✅ Connected to MariaDB at ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}`
    );
  }
  return AppDataSource;
};
