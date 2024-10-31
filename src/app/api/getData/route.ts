import { NextResponse } from 'next/server';
import { initializeDatabase } from '../../lib/typeorm';
import { Channel } from '../../../entities/Channel';

export async function GET() {
  // initialize database connection
  const dataSource = await initializeDatabase();
  const channelRepo = dataSource.getRepository(Channel);

  try {
    // fetch channels along with their playlists/urls
    const channels = await channelRepo.find({ relations: ['playlists'] });
    //DEBUGGING
    //console.log('channels:', channels);

    return NextResponse.json({ channels });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}