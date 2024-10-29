import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../lib/db';

export async function GET(req: NextRequest) {
  try {
    const rows = await query('SELECT * FROM test_table');
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
