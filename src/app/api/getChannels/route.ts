import { NextResponse } from 'next/server';
import {
  ensureValidServiceToken,
  fetchServiceToken
} from '../../lib/serviceToken'; // service token handler

// Define the external API URL and get the JWT token from environment variables
const API_URL = 'https://api-ce.prod.osaas.io/channel';

export async function GET() {
  try {
    // check if token is valid, else generate a new one
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
