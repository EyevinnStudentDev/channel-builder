import { DataSource } from 'typeorm';
import { ChannelEntity } from './src/entities/ChannelEntity';

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true,
  logging: true,
  entities: [ChannelEntity],
});
