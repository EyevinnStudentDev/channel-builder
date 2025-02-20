import { DataSource } from 'typeorm';
import { Channel } from '../../entities/Channel';
import { Playlist } from '../../entities/Playlist';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT) || 3306,
  username: process.env.MYSQL_USER || 'test',
  password: process.env.MYSQL_PASSWORD || 'test123',
  database: process.env.MYSQL_DATABASE || 'test',
  synchronize: false, // set to true for development
  logging: false, // for debugging
  entities: [Channel, Playlist]
});

export default AppDataSource;
