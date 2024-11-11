import { NextResponse } from 'next/server';
import {
  ensureValidServiceToken,
  fetchServiceToken
} from '../../lib/serviceToken'; // service token handler

// define payload type for the POST request
interface ChannelPayload {
  name: string;
  type: string;
  url: string;
}

const API_URL = 'https://api-ce.prod.osaas.io/channel';

/**
 * @swagger
 * /api/postChannel:
 *   post:
 *     summary: Creates a new channel in the OSAAS Channel Engine.
 *     description: This endpoint creates a new channel with the specified details (name, type, and URL) in the OSAAS Channel Engine.
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
 *               type:
 *                 type: string
 *                 description: The type of the channel.
 *               url:
 *                 type: string
 *                 description: The URL of the channel.
 *             required:
 *               - name
 *               - type
 *               - url
 *     responses:
 *       200:
 *         description: Successfully created the channel.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request, invalid or missing data.
 *       500:
 *         description: Internal server error.
 */

export async function POST(req: Request) {
  try {
    // check if token is valid, else generate a new one
    const serviceToken = await fetchServiceToken();
    //console.log('Service token:', serviceToken);

    const body: ChannelPayload = await req.json();
    console.log('Channel payload:', body);

    // POST request to OSAAS to create channel in FAST Channel Engine
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-jwt': `Bearer ${serviceToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json(
      { error: 'Failed to create channel' },
      { status: 500 }
    );
  }
}
