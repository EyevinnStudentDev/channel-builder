import { DataSource } from 'typeorm';
import { Channel } from './src/entities/Channel';
import { Playlist } from './src/entities/Playlist';

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  //logging: true, // for debugging
  entities: [Channel, Playlist],
  synchronize: true
});
