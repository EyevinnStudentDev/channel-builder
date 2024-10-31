// src/app/api/showTables/route.ts
import { NextResponse } from 'next/server';
import { query } from '../../lib/db';

export async function GET() {
  try {
    const tables = await query('SHOW TABLES');
    return NextResponse.json({ tables });
  } catch (error) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}