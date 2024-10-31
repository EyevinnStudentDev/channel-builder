import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropAllTables1689072846749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Retrieve all tables in the database
    const tables = await queryRunner.query(`SHOW TABLES`);
    
    // Drop each table
    for (const table of tables) {
      const tableName = table[`Tables_in_${process.env.MYSQL_DATABASE}`];
      await queryRunner.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No rollback needed, as this is a destructive operation
  }
}
