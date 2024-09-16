import { NextResponse } from 'next/server';
import { ensureValidServiceToken } from '../../lib/serviceToken'; // service token handler

// define payload for the POST request
interface ChannelPayload {
  name: string;
  type: string;
  url: string;
}

const API_URL = 'https://api-ce.prod.osaas.io/channel';

export async function POST(req: Request) {
  try {
    // check if token is valid
    const serviceToken = await ensureValidServiceToken();

    const body: ChannelPayload = await req.json();

    // POST request to OSAAS
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-jwt': `Bearer ${serviceToken}`, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error creating channel:', error);
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 });
  }
}
