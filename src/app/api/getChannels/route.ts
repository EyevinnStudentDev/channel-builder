import { NextResponse } from 'next/server';
import { ensureValidServiceToken } from '../../lib/serviceToken'; // service token handler

// Define the external API URL and get the JWT token from environment variables
const API_URL = 'https://api-ce.prod.osaas.io/channel';

export async function GET() {
    try {
        // check if token is valid, else generate a new one
        const serviceToken = await ensureValidServiceToken();

        // GET request to OSAAS to get channels from FAST Channel Engine
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'x-jwt': `Bearer ${serviceToken}`, 
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error fetching channel data:', errorText);
            return NextResponse.json({ error: 'Failed to fetch channel data' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error fetching channel data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
