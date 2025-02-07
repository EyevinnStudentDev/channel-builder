import { NextResponse } from 'next/server';
import { fetchServiceToken } from '../../lib/serviceToken'; // service token handler

// Define the external API URL and get the JWT token from environment variables
const API_URL = 'https://api-ce.prod.osaas.io/channel';
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/getChannels:
 *   get:
 *     summary: Fetches channel data from the Eyevinn FAST Channel Engine.
 *     description: This endpoint fetches channel information from the OSAAS API using a JWT token.
 *     responses:
 *       200:
 *         description: Returns a list of channels.
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
 *       500:
 *         description: Internal server error.
 *       401:
 *         description: Unauthorized due to invalid token.
 */
export async function GET() {
  try {
    const serviceToken = await fetchServiceToken();

    // GET request to OSAAS to get channels from FAST Channel Engine
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-jwt': `Bearer ${serviceToken}`
      },
      cache: 'no-store' // disable cache
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching channel data:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch channel data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // the response is not cached
    const headers = new Headers({
      'Cache-Control': 'no-store'
    });

    return NextResponse.json(data, { status: response.status, headers });
  } catch (error) {
    console.error('Error fetching channel data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
