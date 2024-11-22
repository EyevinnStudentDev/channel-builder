import { NextResponse } from 'next/server';
import { initializeDatabase } from '../../lib/typeorm';
import { Channel } from '../../../entities/Channel';
import redisClient, { connectRedis } from '../../lib/redis';

// define the key for caching
const REDIS_KEY = 'channels_data';


export async function GET() {
  try {
    /* CACHE START */
    // connect redis
    await connectRedis();

    // check cache for data
    const cachedData = await redisClient.get(REDIS_KEY);
    if (cachedData) {
      console.log('Cache hit');
      return NextResponse.json({ channels: JSON.parse(cachedData) });
    }
    // DEBUGGING
    console.log('Cache miss');
    /* CACHE END */

    // initialize database connection
    const dataSource = await initializeDatabase();
    const channelRepo = dataSource.getRepository(Channel);

    // fetch channels along with their playlists/urls
    const channels = await channelRepo.find({ relations: ['playlists'] });
    //DEBUGGING
    //console.log('channels:', channels);

    // cache the data
    await redisClient.set(REDIS_KEY, JSON.stringify(channels), {
      EX: 60 * 1, // expiration in seconds
    });

    return NextResponse.json({ channels });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}