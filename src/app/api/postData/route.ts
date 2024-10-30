import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../lib/typeorm';
import { ChannelEntity } from '../../../entities/ChannelEntity';

export async function POST(req: NextRequest) {
  const dataSource = await initializeDatabase();
  const exampleRepo = dataSource.getRepository(ChannelEntity);
  const { name, description } = await req.json();

  try {
    const newEntry = exampleRepo.create({ name, description });
    await exampleRepo.save(newEntry);
    return NextResponse.json({ message: 'Data added successfully', newEntry });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
  }
}
