import { NextResponse } from 'next/server';
import { initializeDatabase } from '../../lib/typeorm';
import { Channel } from '../../../entities/Channel';
import redisClient, { connectRedis } from '../../lib/redis';

// define the key for caching
const REDIS_KEY = 'channels_data';

/**
 * @swagger
 * /api/getData:
 *   get:
 *     summary: Fetches channel data along with playlists from the database.
 *     description: This endpoint retrieves channels along with their associated playlists from the database using TypeORM.
 *     responses:
 *       200:
 *         description: Successfully fetched channels and playlists data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 channels:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       playlists:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             fileName:
 *                               type: string
 *                             fileUrl:
 *                               type: string
 *       500:
 *         description: Internal server error when fetching data.
 */
export async function GET() {
  try {
    // initialize database connection
    const dataSource = await initializeDatabase();
    const channelRepo = dataSource.getRepository(Channel);

    // fetch channels along with their playlists/urls
    const channels = await channelRepo.find({ relations: ['playlists'] });

    return NextResponse.json({ channels });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
