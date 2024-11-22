import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../lib/typeorm';
import { Channel } from '../../../entities/Channel';
import { Playlist } from '../../../entities/Playlist';
import redisClient, { connectRedis } from '../../lib/redis';


export async function POST(req: NextRequest) {
  // initialize database connection
  const dataSource = await initializeDatabase();
  const channelRepository = dataSource.getRepository(Channel);
  const playlistRepository = dataSource.getRepository(Playlist);

  try {
    // connect redis
    await connectRedis();

    // parsing request 
    const { name, description, playlists } = await req.json();

    // create a new Channel entity and save
    const newChannel = channelRepository.create({ name, description });
    await channelRepository.save(newChannel);

    // if playlists in the request
    if (playlists && playlists.length > 0) {
      const newPlaylists = playlists.map((playlist: { fileName: string; fileUrl: string }) => {
        return playlistRepository.create({
          fileName: playlist.fileName,
          fileUrl: playlist.fileUrl,
          channel: newChannel, // associate playlist with the new channel
        });
      });

      await playlistRepository.save(newPlaylists);
      newChannel.playlists = newPlaylists; // attach playlists to the channel entity
    }

    // clear cache
    try {
      await redisClient.del('channels_data');
      // DEBUGGING
      console.log('Cache cleared');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }

    return NextResponse.json(newChannel);
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
  } 
}