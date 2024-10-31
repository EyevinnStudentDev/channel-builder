// src/app/api/describeTable/route.ts
import { NextResponse } from 'next/server';
import { query } from '../../lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get('table');
    
    if (!tableName) {
      return NextResponse.json({ error: 'Table name required' }, { status: 400 });
    }

    // First verify the table exists
    const tables = await query('SHOW TABLES');
    const tableExists = tables.some((t: any) => 
      t[`Tables_in_${process.env.MYSQL_DATABASE}`] === tableName
    );

    if (!tableExists) {
      return NextResponse.json({ error: `Table '${tableName}' not found` }, { status: 404 });
    }

    // Now safely describe the table
    const structure = await query(`SHOW COLUMNS FROM ${tableName}`);
    return NextResponse.json({ structure });

  } catch (error: any) {
    console.error('Error describing table:', error.message);
    return NextResponse.json({ 
      error: 'Failed to describe table',
      details: error.message 
    }, { status: 500 });
  }
}