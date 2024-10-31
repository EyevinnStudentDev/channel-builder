// src/app/lib/db.ts
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Channel } from "../entities/Channel"

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true, // Creates tables automatically - be careful with this in production!
    logging: true,
    entities: [Channel],
})

let initialized = false;

export async function getDb() {
    if (!initialized) {
        await AppDataSource.initialize();
        initialized = true;
    }
    return AppDataSource;
}

// Keep this for backward compatibility if needed
export async function query(sql: string, values?: any[]) {
    const db = await getDb();
    return db.query(sql, values);
}
