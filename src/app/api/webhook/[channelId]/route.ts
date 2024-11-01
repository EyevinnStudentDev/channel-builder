import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../../lib/typeorm';
import { AppDataSource } from '../../../../../typorm.config';
import { Channel } from '../../../../entities/Channel';
import { Playlist } from '../../../../entities/Playlist';


/* webhook for fetching next video to play */
// IMPROVEMENT: USE A SDK LIKE REDIS TO CACHE THE PLAYLISTS AND REDUCE DATABASE QUERIES
// webhook doesnt work with the current setup because we send in a localhost url to Eyevinns fast channel engine
export async function GET(req: NextRequest, { params }: { params: { channelId: string } }) {
  const { channelId } = params;
  //DEBUG
  console.log('Webhook req for channelId:', channelId);

  try {
    // init database if not initialized
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    // fetch the channel with playlists by ID
    const channelRepository = AppDataSource.getRepository(Channel);
    const channel = await channelRepository.findOne({
      where: { id: channelId },
      relations: ['playlists'],
    });

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // check if the channel has any playlists, and select a random one
    const selectedUrl = channel.playlists.length > 0 ? channel.playlists[Math.floor(Math.random() * channel.playlists.length)] : null;

    if (!selectedUrl) {
      return NextResponse.json({ error: 'No playlists available for this channel' }, { status: 404 });
    }

    return NextResponse.json({
      id: selectedUrl.id,
      title: selectedUrl.fileName,
      hlsUrl: selectedUrl.fileUrl,
      prerollUrl: "", // preroll ad url
      prerollDurationMs: 0, // preroll ad duration
    });
  } catch (error) {
    console.error('Error fetching channel data:', error);
    return NextResponse.json({ error: 'Failed to fetch channel data' }, { status: 500 });
  }
}

/* webhook to modify playlists */
export async function POST(req: NextRequest, { params }: { params: { channelId: string } }) {
  const { channelId } = params;
  console.log('Webhook triggered for channelId:', channelId);

  try {
    // init database if not initialized
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();

    // fetch the channel and playlists by ID
    const channelRepository = AppDataSource.getRepository(Channel);
    const playlistRepository = AppDataSource.getRepository(Playlist);

    const channel = await channelRepository.findOne({
      where: { id: channelId },
      relations: ['playlists'],
    });

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // parse request body
    const { addPlaylists, removePlaylists } = await req.json();
    
    // add new playlists to the channel
    if (addPlaylists && Array.isArray(addPlaylists)) {
      const newPlaylists = addPlaylists.map((playlist: { fileName: string; fileUrl: string }) =>
        playlistRepository.create({
          fileName: playlist.fileName,
          fileUrl: playlist.fileUrl,
          channel: channel, // associate playlist with the channel
        })
      );

      await playlistRepository.save(newPlaylists);
      channel.playlists = [...channel.playlists, ...newPlaylists]; // update the channels playlists array
    }

    // remove playlists from the channel
    if (removePlaylists && Array.isArray(removePlaylists)) {
      await Promise.all(
        removePlaylists.map(async (playlistId: string) => {
          await playlistRepository.delete({ id: playlistId, channel: channel });
        })
      );

      // filter out the removed playlists from the channels playlists array
      channel.playlists = channel.playlists.filter(
        (playlist) => !removePlaylists.includes(playlist.id)
      );
    }

    return NextResponse.json({
      message: 'Webhook processed successfully',
      channelId: channel.id,
      channelName: channel.name,
      updatedPlaylists: channel.playlists.map((playlist) => ({
        id: playlist.id,
        fileName: playlist.fileName,
        fileUrl: playlist.fileUrl,
      })),
    });
  } catch (error) {
    console.error('Error processing webhook data:', error);
    return NextResponse.json({ error: 'Failed to process webhook data' }, { status: 500 });
  }
}