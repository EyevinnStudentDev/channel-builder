import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../lib/typeorm';
import { Channel } from '../../../entities/Channel';
import { Playlist } from '../../../entities/Playlist';

/**
 * @swagger
 * /api/postData:
 *   post:
 *     summary: Creates a new channel with optional playlists.
 *     description: This endpoint creates a new channel with a name and description, and optionally associates playlists with it.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the channel.
 *               description:
 *                 type: string
 *                 description: A description of the channel.
 *               playlists:
 *                 type: array
 *                 description: A list of playlists to associate with the new channel.
 *                 items:
 *                   type: object
 *                   properties:
 *                     fileName:
 *                       type: string
 *                       description: The file name of the playlist.
 *                     fileUrl:
 *                       type: string
 *                       description: The URL of the playlist file.
 *     responses:
 *       200:
 *         description: Successfully created the channel and associated playlists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 playlists:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fileName:
 *                         type: string
 *                       fileUrl:
 *                         type: string
 *       400:
 *         description: Bad request, invalid or missing data.
 *       500:
 *         description: Internal server error.
 */
export async function POST(req: NextRequest) {
  try {
    //DEBUGG
    console.log('POST DATA entitiy names: ', Channel.name, Playlist.name);

    // init db
    const dataSource = await initializeDatabase();
    const channelRepository = dataSource.getRepository(Channel);
    const playlistRepository = dataSource.getRepository(Playlist);

    // parse req
    const { name, description, playlists } = await req.json();
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // create Channel entry in db
    const newChannel = new Channel();
    newChannel.name = name;
    newChannel.description = description;

    await channelRepository.save(newChannel); // Save channel first

    // Step 4: Insert Playlists if Provided (Associating Channel by ID)
    /*
    if (playlists && playlists.length > 0) {
      const playlistEntities = playlists.map(
        (playlist: { fileName: string; fileUrl: string }) => {
          const newPlaylist = new Playlist();
          newPlaylist.fileName = playlist.fileName;
          newPlaylist.fileUrl = playlist.fileUrl;
          newPlaylist.channel = newChannel; // ✅ Use full channel entity, not just ID
          return newPlaylist;
        }
      );

      await playlistRepository.save(playlistEntities); // Save playlists separately
      newChannel.playlists = playlistEntities; // Attach saved playlists to channel
    }
  */
    if (playlists && playlists.length > 0) {
      for (const playlist of playlists) {
        const newPlaylist = new Playlist();
        newPlaylist.fileName = playlist.fileName;
        newPlaylist.fileUrl = playlist.fileUrl;
        newPlaylist.channel = newChannel;
        await playlistRepository.manager.save(newPlaylist);
      }
    }

    return NextResponse.json(newChannel);
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
  }
}
