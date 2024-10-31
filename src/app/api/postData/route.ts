import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../lib/typeorm';
import { Channel } from '../../../entities/Channel';
import { Playlist } from '../../../entities/Playlist';


export async function POST(req: NextRequest) {
  // initialize database connection
  const dataSource = await initializeDatabase();
  const channelRepository = dataSource.getRepository(Channel);
  const playlistRepository = dataSource.getRepository(Playlist);

  try {
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

    return NextResponse.json({ message: 'Channel and playlists added successfully', newChannel });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
  }
}