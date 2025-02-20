import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../../lib/typeorm';
import { Channel } from '../../../../entities/Channel';
import { Playlist } from '../../../../entities/Playlist';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  const { channelId } = params;

  try {
    // init database connection
    const dataSource = await initializeDatabase();
    const channelRepo = dataSource.getRepository(Channel);
    const playlistRepo = dataSource.getRepository(Playlist);

    // Check if the channel exists
    const channel = await channelRepo.findOne({
      where: { id: channelId },
      relations: ['playlists']
    });

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    // delete playlists entries of channel
    if (channel.playlists && channel.playlists.length > 0) {
      await playlistRepo.delete({ channel: { id: channelId } });
    }

    // delete channel entry
    await channelRepo.delete({ id: channelId });

    return NextResponse.json({
      message: 'Channel and associated playlists deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting channel:', error);
    return NextResponse.json(
      { error: 'Failed to delete channel' },
      { status: 500 }
    );
  }
}
