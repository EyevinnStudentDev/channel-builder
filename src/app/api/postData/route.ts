import { NextRequest, NextResponse } from 'next/server';
import { query } from '../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    const result = await query(
      'INSERT INTO test_table (name, description) VALUES (?, ?)',
      [name, description]
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: 'Failed to insert data' }, { status: 500 });
  }
}
