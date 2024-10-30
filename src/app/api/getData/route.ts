import { NextResponse } from 'next/server';
import { initializeDatabase } from '../../lib/typeorm';
import { ChannelEntity } from '../../../entities/ChannelEntity';

export async function GET() {
  const dataSource = await initializeDatabase();
  const exampleRepo = dataSource.getRepository(ChannelEntity);

  try {
    const data = await exampleRepo.find();
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
