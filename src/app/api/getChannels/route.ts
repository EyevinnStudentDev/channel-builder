// src/app/api/getChannels/route.ts
import { NextResponse } from 'next/server';
import { getDb } from '../../lib/db';
import { Channel } from '../../entities/Channel';

export async function GET() {
    try {
        const db = await getDb();
        const channelRepository = db.getRepository(Channel);
        
        // Get all channels from our database
        const channels = await channelRepository.find();
        
        return NextResponse.json(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        return NextResponse.json(
            { error: 'Failed to fetch channels' },
            { status: 500 }
        );
    }
}